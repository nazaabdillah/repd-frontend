'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser, UserButton, useAuth, SignInButton } from '@clerk/nextjs'

// --- 1. SVG ICONS ---
const Icons = {
  Schedule: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><rect x="3" y="4" width="18" height="18" rx="0" ry="0"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Tracker: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  History: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>,
  Weight: () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M20.59 13.41l-7.17 7.17a0 0 0 0 1-2.83 0L2 12V2h10l8.59 8.59a0 0 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
  Push: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>,
  Pull: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>,
  Legs: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
  FullBody: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><circle cx="12" cy="12" r="10"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/></svg>,
  Rest: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Check: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="square" strokeLinejoin="miter"><polyline points="20 6 9 17 4 12"/></svg>,
  Camera: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter"><path d="M23 19H3V8h4l2-3h6l2 3h4v11z"/><circle cx="12" cy="13" r="4"/></svg>
}

// --- 2. CONFIG & TYPES ---
const API_URL = 'http://127.0.0.1:8080/api/v1'

type IconName = 'Push' | 'Pull' | 'Legs' | 'Rest' | 'FullBody'
interface DailyRoutine { day: string; type: string; badge: string; icon: IconName; exercises: { name: string; sets: number; reps: number }[] }
interface Template { id: string; name: string; description: string; schedule: DailyRoutine[] }

const TEMPLATES: Record<string, Template> = {
  'v-taper': {
    id: 'v-taper', name: 'PPL V-Taper', description: 'Fokus bahu & punggung lebar (Push-Pull-Legs).',
    schedule: [
      { day: 'Senin', type: 'Push Day', badge: 'push', icon: 'Push', exercises: [{ name: 'Push Ups', sets: 3, reps: 10 }, { name: 'Single Arm Overhead Press', sets: 4, reps: 12 }, { name: 'Decline Push-Ups', sets: 4, reps: 15 }] },
      { day: 'Selasa', type: 'Pull Day', badge: 'pull', icon: 'Pull', exercises: [{ name: 'Single Arm Rows', sets: 4, reps: 12 }, { name: 'Bicep Curls', sets: 4, reps: 12 }, { name: 'Pull Ups', sets: 4, reps: 12 }] },
      { day: 'Rabu', type: 'Legs & Shoulders', badge: 'legs', icon: 'Legs', exercises: [{ name: 'Squats', sets: 4, reps: 10 }, { name: 'Calf Raises', sets: 4, reps: 12 }, { name: 'Lateral Raises', sets: 4, reps: 15 }] },
      { day: 'Kamis', type: 'Rest Day', badge: 'rest', icon: 'Rest', exercises: [] },
      { day: 'Jumat', type: 'Push Day', badge: 'push', icon: 'Push', exercises: [{ name: 'Push Ups', sets: 3, reps: 10 }, { name: 'Close Grip Push Ups', sets: 4, reps: 12 }] },
      { day: 'Sabtu', type: 'Pull Day', badge: 'pull', icon: 'Pull', exercises: [{ name: 'Single Arm Rows', sets: 4, reps: 12 }, { name: 'Hammer Curls', sets: 4, reps: 12 }] },
      { day: 'Minggu', type: 'Legs', badge: 'legs', icon: 'Legs', exercises: [{ name: 'Squats', sets: 4, reps: 10 }, { name: 'Lunges', sets: 3, reps: 12 }] },
    ]
  },
  'full-body': {
    id: 'full-body', name: 'Full Body', description: 'Efisiensi waktu, seluruh otot kena dalam satu sesi.',
    schedule: [
      { day: 'Senin', type: 'Full Body', badge: 'full', icon: 'FullBody', exercises: [{ name: 'Squats', sets: 3, reps: 12 }, { name: 'Push Ups', sets: 3, reps: 12 }, { name: 'Pull Ups', sets: 3, reps: 8 }] },
      { day: 'Selasa', type: 'Rest Day', badge: 'rest', icon: 'Rest', exercises: [] },
      { day: 'Rabu', type: 'Full Body', badge: 'full', icon: 'FullBody', exercises: [{ name: 'Lunges', sets: 3, reps: 12 }, { name: 'Overhead Press', sets: 3, reps: 12 }, { name: 'Rows', sets: 3, reps: 12 }] },
      { day: 'Kamis', type: 'Rest Day', badge: 'rest', icon: 'Rest', exercises: [] },
      { day: 'Jumat', type: 'Full Body', badge: 'full', icon: 'FullBody', exercises: [{ name: 'Deadlifts (DB)', sets: 3, reps: 10 }, { name: 'Dips/Decline Push', sets: 3, reps: 10 }] },
      { day: 'Sabtu', type: 'Rest Day', badge: 'rest', icon: 'Rest', exercises: [] },
      { day: 'Minggu', type: 'Rest Day', badge: 'rest', icon: 'Rest', exercises: [] },
    ]
  }
}

const JS_TO_IDX = [6, 0, 1, 2, 3, 4, 5]
const getTodayIdx = () => JS_TO_IDX[new Date().getDay()]
function formatDate(iso: string) { return new Date(iso).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }) }

interface ExerciseState { sets: boolean[]; rpe: number | null; notes: string }
interface WeightEntry { date: string; weight: number }
interface ProgressPhoto { id: number; date: string; photo_url: string }

export default function Home() {
  const { user, isLoaded, isSignedIn } = useUser()
  const { getToken } = useAuth()
  
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState<'schedule' | 'tracker' | 'history' | 'weight'>('schedule')
  const [activeTemplateId, setActiveTemplateId] = useState<string>('v-taper')
  const [trackerState, setTrackerState] = useState<Record<number, ExerciseState>>({})
  const [sessions, setSessions] = useState<any[]>([])
  const [weightLog, setWeightLog] = useState<WeightEntry[]>([])
  const [weightInput, setWeightInput] = useState('')
  const [photos, setPhotos] = useState<ProgressPhoto[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [toast, setToast] = useState('')

  const todayIdx = getTodayIdx()
  const activeTemplate = TEMPLATES[activeTemplateId]
  const todayData = activeTemplate.schedule[todayIdx]
  const activeUserId = user?.id

  const fetchWeights = useCallback(async (uid: string) => {
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/weights?user_id=${uid}`, { headers: { 'Authorization': `Bearer ${token}` } })
      const json = await res.json()
      if (json.data) setWeightLog(json.data)
    } catch (err) {}
  }, [getToken])

  const fetchPhotos = useCallback(async (uid: string) => {
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/photos?user_id=${uid}`, { headers: { 'Authorization': `Bearer ${token}` } })
      const json = await res.json()
      if (json.data) setPhotos(json.data)
    } catch (err) {}
  }, [getToken])

  const fetchHistory = useCallback(async () => {
    if (!activeUserId) return
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/workouts?user_id=${activeUserId}`, { headers: { 'Authorization': `Bearer ${token}` } })
      const json = await res.json()
      if (json.data) setSessions(json.data)
    } catch (err) {}
  }, [activeUserId, getToken])

  useEffect(() => {
    setMounted(true)
    const saved = localStorage.getItem('repd_template')
    if (saved && TEMPLATES[saved]) setActiveTemplateId(saved)
  }, [])

  useEffect(() => {
    if (isLoaded && isSignedIn && activeUserId) {
      getToken().then(token => {
        fetch(`${API_URL}/users/sync`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ id: activeUserId, email: user.primaryEmailAddress?.emailAddress })
        }).then(() => {
          fetchWeights(activeUserId)
          fetchPhotos(activeUserId)
          if (tab === 'history') fetchHistory()
        })
      })
    }
  }, [isLoaded, isSignedIn, activeUserId, user, fetchWeights, fetchPhotos, fetchHistory, tab, getToken])

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  async function saveSession() {
    if (!activeUserId) return showToast('Harap login dahulu')
    const payload = {
      user_id: activeUserId,
      template_id: activeTemplateId,
      day_name: todayData.day,
      type: todayData.type,
      exercises: todayData.exercises.map((ex, ei) => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        done: (trackerState[ei]?.sets || []).filter(Boolean).length,
        rpe: trackerState[ei]?.rpe || null,
        notes: trackerState[ei]?.notes || ""
      }))
    }

    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setTrackerState({})
        showToast('Sesi tersimpan')
        setTab('history')
      } else { showToast('Gagal menyimpan') }
    } catch (err) { showToast('Error koneksi') }
  }

  async function addWeight() {
    if (!activeUserId) return showToast('Harap login dahulu')
    const val = parseFloat(weightInput)
    if (!val || val < 20) return showToast('Input tidak valid')
    
    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/weights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ user_id: activeUserId, weight: val })
      })
      if (res.ok) {
        setWeightInput(''); showToast('Berat tercatat'); fetchWeights(activeUserId)
      }
    } catch (err) {}
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !activeUserId) return

    setIsUploading(true)
    const formData = new FormData()
    formData.append('photo', file)
    formData.append('user_id', activeUserId)

    try {
      const token = await getToken()
      const res = await fetch(`${API_URL}/photos`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      })
      if (res.ok) {
        showToast('Foto tersimpan!')
        fetchPhotos(activeUserId)
      } else { showToast('Gagal upload') }
    } catch (err) { showToast('Error upload') } finally {
      setIsUploading(false)
      e.target.value = ''
    }
  }

  if (!mounted || !isLoaded) return null

  // Neubrutalism Design System
  const colors = { primary: '#1B3AFF', bg: '#f8faff', text: '#0b132b', textMuted: '#6b7a99' }
  const brutalBorder = `3px solid ${colors.text}`
  const brutalShadow = `4px 4px 0px ${colors.text}`
  
  const brutalCard: React.CSSProperties = { 
    background: '#ffffff', 
    borderRadius: '8px', 
    padding: '1.5rem', 
    marginBottom: '1.25rem', 
    border: brutalBorder, 
    boxShadow: brutalShadow 
  }

  if (!isSignedIn) {
    return (
      <div style={{ minHeight: '100vh', background: colors.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', color: colors.text }}>
        <div style={{ ...brutalCard, textAlign: 'center', padding: '3rem 2rem' }}>
          <img src="/repd-logo.png" alt="REPD" style={{ width: 100, height: 100, objectFit: 'contain', marginBottom: '1rem', border: brutalBorder, borderRadius: '8px', padding: '0.5rem', background: 'white', boxShadow: brutalShadow }} />
          <h1 style={{ fontWeight: 900, fontSize: '2.5rem', marginBottom: '0.5rem', letterSpacing: '-1px' }}>REPD</h1>
          <p style={{ color: colors.text, fontWeight: 600, marginBottom: '2rem' }}>Akses sistem data latih tertutup.</p>
          
          <SignInButton mode="modal">
            <button className="brutal-btn" style={{ background: colors.primary, color: 'white', padding: '1rem 2rem', borderRadius: '8px', border: brutalBorder, boxShadow: brutalShadow, fontWeight: 900, fontSize: '1rem', width: '100%' }}>
              SIGN IN / REGISTER
            </button>
          </SignInButton>
        </div>
        <style>{`
          .brutal-btn { cursor: pointer; transition: all 0.1s ease-out; }
          .brutal-btn:active { transform: translate(4px, 4px); box-shadow: 0px 0px 0px ${colors.text} !important; }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: colors.bg, color: colors.text, fontFamily: '"Courier New", Courier, monospace, system-ui' }}>
      
      {/* HEADER */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: '#ffffff', borderBottom: brutalBorder, padding: '0 1.5rem', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <img src="/repd-logo.png" alt="REPD Logo" style={{ width: 80, height: 80, objectFit: 'contain', borderRadius: '4px', padding: '4px' }} />
          <span style={{ fontWeight: 900, fontSize: '1.5rem', letterSpacing: '-1px' }}>REP<span style={{ color: colors.primary }}>D</span></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <UserButton afterSignOutUrl="/"/>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ padding: '2rem 1.25rem 7rem', maxWidth: 600, margin: '0 auto' }}>

        {/* --- SCHEDULE TAB --- */}
        {tab === 'schedule' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.85rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '0.75rem', borderBottom: brutalBorder, display: 'inline-block', paddingBottom: '0.2rem' }}>Pilih Program</p>
              <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                {Object.values(TEMPLATES).map(t => (
                  <button key={t.id} className="brutal-btn" onClick={() => { setActiveTemplateId(t.id); localStorage.setItem('repd_template', t.id); showToast(`Program: ${t.name}`) }} 
                    style={{ whiteSpace: 'nowrap', padding: '0.8rem 1.2rem', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 900, 
                             background: t.id === activeTemplateId ? colors.primary : '#ffffff', 
                             color: t.id === activeTemplateId ? '#ffffff' : colors.text, 
                             border: brutalBorder, boxShadow: brutalShadow }}>
                    {t.name}
                  </button>
                ))}
              </div>
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-1px' }}>Jadwal Minggu</h2>
            <p style={{ background: colors.primary, color: 'white', display: 'inline-block', padding: '0.2rem 0.8rem', border: brutalBorder, fontWeight: 900, marginBottom: '2rem', borderRadius: '4px' }}>Hari ini: {todayData.type}</p>

            {activeTemplate.schedule.map((d, i) => {
              const isToday = i === todayIdx; const IconComp = Icons[d.icon] || Icons.Push
              return (
                <div key={d.day} style={{ ...brutalCard, background: isToday ? colors.primary : '#ffffff', color: isToday ? '#ffffff' : colors.text, opacity: d.badge === 'rest' && !isToday ? 0.7 : 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: d.exercises.length > 0 ? '1.5rem' : 0 }}>
                    <div style={{ background: isToday ? '#ffffff' : colors.bg, color: isToday ? colors.text : colors.primary, padding: '0.6rem', border: isToday ? `3px solid ${colors.text}` : brutalBorder, borderRadius: '8px', boxShadow: isToday ? '2px 2px 0px #0b132b' : 'none' }}>
                      <IconComp />
                    </div>
                    <div>
                      <h3 style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase' }}>{d.day}</h3>
                      <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{d.type}</p>
                    </div>
                  </div>
                  {d.exercises.map((ex, ei) => (
                    <div key={ei} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: ei < d.exercises.length - 1 ? `2px dashed ${isToday ? '#ffffff' : colors.text}` : 'none', fontSize: '0.9rem', fontWeight: 700 }}>
                      <span>{ex.name}</span><span style={{ fontWeight: 900, background: isToday ? '#ffffff' : colors.bg, color: isToday ? colors.text : colors.text, padding: '0.2rem 0.6rem', border: isToday ? '2px solid #0b132b' : `2px solid ${colors.text}`, borderRadius: '4px' }}>{ex.sets}x{ex.reps}</span>
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        )}

        {/* --- TRACKER TAB --- */}
        {tab === 'tracker' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', borderBottom: brutalBorder, display: 'inline-block' }}>Tracker Sesi</h2>
              <p style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.5rem' }}>{activeTemplate.name} - {todayData.type}</p>
            </div>
            
            {todayData.exercises.length === 0 ? <div style={{ ...brutalCard, textAlign: 'center', padding: '3rem', fontWeight: 900 }}>REST DAY.</div> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {todayData.exercises.map((ex, ei) => {
                  const state = trackerState[ei] || { sets: Array(ex.sets).fill(false), rpe: null, notes: '' }
                  const doneCount = state.sets.filter(Boolean).length
                  const allDone = doneCount === ex.sets
                  
                  return (
                    <div key={ei} style={{ ...brutalCard, background: allDone ? '#e2fadb' : '#ffffff' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                        <div>
                          <h3 style={{ fontWeight: 900, fontSize: '1.2rem', textTransform: 'uppercase' }}>{ex.name}</h3>
                          <p style={{ fontSize: '0.85rem', fontWeight: 700, marginTop: '0.4rem' }}>Target: {ex.sets} Sets × {ex.reps} Reps</p>
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 900, color: allDone ? '#ffffff' : colors.text, background: allDone ? colors.text : '#ffffff', border: brutalBorder, padding: '0.4rem 0.8rem', borderRadius: '4px' }}>
                          {doneCount}/{ex.sets}
                        </span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(ex.sets, 4)}, 1fr)`, gap: '0.8rem', marginBottom: '1.5rem' }}>
                        {state.sets.map((done, si) => (
                          <button key={si} className="brutal-btn" onClick={() => {
                            const newSets = [...state.sets]; newSets[si] = !newSets[si]
                            setTrackerState(p => ({ ...p, [ei]: { ...state, sets: newSets } }))
                          }} style={{ padding: '0.8rem 0', borderRadius: '8px', background: done ? colors.primary : '#ffffff', border: brutalBorder, boxShadow: done ? 'none' : '2px 2px 0px #0b132b', transform: done ? 'translate(2px, 2px)' : 'none', color: done ? '#ffffff' : colors.text, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.7rem', fontWeight: 900, marginBottom: '0.2rem' }}>SET {si + 1}</span>
                            <span style={{ fontWeight: 900, fontSize: '1.3rem' }}>{done ? <Icons.Check /> : ex.reps}</span>
                          </button>
                        ))}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: 900 }}>RPE:</span>
                        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '4px' }}>
                          {[6, 7, 8, 9, 10].map(r => (
                            <button key={r} className="brutal-btn" onClick={() => setTrackerState(p => ({ ...p, [ei]: { ...state, rpe: state.rpe === r ? null : r } }))} 
                               style={{ padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 900, background: state.rpe === r ? colors.text : '#ffffff', color: state.rpe === r ? '#ffffff' : colors.text, border: brutalBorder, boxShadow: state.rpe === r ? 'none' : '2px 2px 0px #0b132b', transform: state.rpe === r ? 'translate(2px, 2px)' : 'none' }}>
                              {r}
                            </button>
                          ))}
                        </div>
                      </div>

                      <input type="text" placeholder="Catatan set..." value={state.notes} onChange={e => setTrackerState(p => ({ ...p, [ei]: { ...state, notes: e.target.value } }))} 
                        style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: brutalBorder, background: colors.bg, fontSize: '0.9rem', fontWeight: 700, outline: 'none', color: colors.text, fontFamily: 'inherit' }} />
                    </div>
                  )
                })}
                
                <button className="brutal-btn" onClick={saveSession} style={{ width: '100%', padding: '1.25rem', background: colors.primary, color: 'white', fontWeight: 900, fontSize: '1.1rem', borderRadius: '8px', border: brutalBorder, boxShadow: brutalShadow, marginTop: '1rem' }}>
                  SIMPAN SESI
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- HISTORY TAB --- */}
        {tab === 'history' && (
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', textTransform: 'uppercase', borderBottom: brutalBorder, display: 'inline-block' }}>Riwayat Sinkron</h2>
            {sessions.length === 0 ? (
              <div style={{ ...brutalCard, textAlign: 'center', padding: '3rem', fontWeight: 900 }}>KOSONG.</div>
            ) : (
              sessions.map(s => {
                const totalSets = s.Exercises?.reduce((acc: number, ex: any) => acc + ex.target_sets, 0) || 0
                const doneSets = s.Exercises?.reduce((acc: number, ex: any) => acc + ex.completed_sets, 0) || 0
                const pct = totalSets > 0 ? Math.round((doneSets / totalSets) * 100) : 0

                return (
                  <div key={s.id} style={brutalCard}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `2px dashed ${colors.text}`, paddingBottom: '1rem', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ fontWeight: 900, fontSize: '1.1rem', textTransform: 'uppercase' }}>{s.day_name}</p>
                        <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{formatDate(s.date)}</p>
                      </div>
                      <span style={{ fontSize: '1rem', fontWeight: 900, background: colors.text, color: '#ffffff', padding: '0.4rem 0.8rem', borderRadius: '4px', height: 'fit-content' }}>{pct}%</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {s.Exercises?.map((ex: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 700 }}>
                          <span>{ex.exercise_name}</span>
                          <span style={{ background: colors.bg, padding: '0.1rem 0.5rem', border: `1px solid ${colors.text}`, borderRadius: '4px' }}>{ex.completed_sets}/{ex.target_sets}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* --- PROGRESS TAB --- */}
        {tab === 'weight' && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ fontSize: '1.8rem', fontWeight: 900, textTransform: 'uppercase', borderBottom: brutalBorder, display: 'inline-block' }}>Metrik Fisik</h2>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
              <input type="number" placeholder="Berat (kg)" value={weightInput} onChange={e => setWeightInput(e.target.value)} 
                style={{ flex: 1, padding: '1rem', borderRadius: '8px', border: brutalBorder, boxShadow: '2px 2px 0px #0b132b', outline: 'none', fontWeight: 900, fontSize: '1rem', fontFamily: 'inherit' }} />
              <button className="brutal-btn" onClick={addWeight} style={{ background: colors.primary, color: 'white', padding: '0 1.5rem', borderRadius: '8px', border: brutalBorder, boxShadow: brutalShadow, fontWeight: 900 }}>INPUT</button>
              
              <label className="brutal-btn" style={{ background: colors.text, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 1.2rem', borderRadius: '8px', border: brutalBorder, boxShadow: brutalShadow, opacity: isUploading ? 0.5 : 1 }}>
                {isUploading ? '...' : <Icons.Camera />}
                <input type="file" accept="image/*" capture="environment" onChange={handlePhotoUpload} style={{ display: 'none' }} disabled={isUploading} />
              </label>
            </div>

            {photos.length > 0 && (
              <div style={{ marginBottom: '3rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1rem', textTransform: 'uppercase' }}>Log Visual</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                  {photos.map((p) => (
                    <div key={p.id} style={{ position: 'relative', width: '100%', paddingBottom: '130%', borderRadius: '8px', overflow: 'hidden', border: brutalBorder, boxShadow: brutalShadow }}>
                      <img src={`http://127.0.0.1:8080${p.photo_url}`} alt="Progress" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: colors.text, borderTop: brutalBorder, padding: '0.5rem', color: 'white', fontSize: '0.75rem', fontWeight: 900, textAlign: 'center' }}>
                        {formatDate(p.date)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '1rem', textTransform: 'uppercase' }}>Data Numerik</h3>
            {weightLog.length === 0 ? <div style={{ ...brutalCard, textAlign: 'center', fontWeight: 900 }}>KOSONG.</div> : (
              weightLog.map((w, i) => {
                const diff = weightLog[i+1] ? w.weight - weightLog[i+1].weight : null
                return (
                  <div key={i} style={{ ...brutalCard, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontSize: '0.85rem', fontWeight: 900 }}>{formatDate(w.date)}</p>
                      {diff !== null && <p style={{ fontSize: '0.8rem', color: colors.text, fontWeight: 900, background: diff > 0 ? '#e2fadb' : '#ffe2e2', display: 'inline-block', padding: '0.1rem 0.4rem', border: `1px solid ${colors.text}`, borderRadius: '4px', marginTop: '0.2rem' }}>{diff > 0 ? '+' : ''}{diff.toFixed(1)} kg</p>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.3rem' }}><span style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>{w.weight}</span><span style={{ fontSize: '0.9rem', fontWeight: 900 }}>kg</span></div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* CREDITS FOOTER */}
        <div style={{ textAlign: 'center', marginTop: '5rem', marginBottom: '2rem', borderTop: brutalBorder, paddingTop: '2rem' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 900, letterSpacing: '2px' }}>ENGINEERED BY</p>
          <img src="/studio-logo.png" alt="Studio Logo" style={{ height: 100, objectFit: 'contain', margin: '1rem auto', display: 'block', background: '#fff', padding: '0.5rem',  }} />
        </div>

      </div>

      {/* BOTTOM NAV */}
      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#ffffff', borderTop: brutalBorder, padding: '0.5rem 1rem 1rem', display: 'flex', justifyContent: 'space-around', zIndex: 100 }}>
        {[{ key: 'schedule', label: 'Jadwal', icon: Icons.Schedule }, { key: 'tracker', label: 'Tracker', icon: Icons.Tracker }, { key: 'history', label: 'Riwayat', icon: Icons.History }, { key: 'weight', label: 'Metrik', icon: Icons.Weight }].map(item => (
          <button key={item.key} onClick={() => setTab(item.key as any)} className="nav-btn" 
            style={{ background: tab === item.key ? colors.text : 'transparent', color: tab === item.key ? '#ffffff' : colors.text, border: tab === item.key ? brutalBorder : '3px solid transparent', borderRadius: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 0', width: '70px' }}>
            <item.icon /><span style={{ fontSize: '0.7rem', fontWeight: 900 }}>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* CSS & TOAST */}
      {toast && <div style={{ position: 'fixed', top: '90px', left: '50%', transform: 'translateX(-50%)', background: colors.primary, color: 'white', padding: '1rem 2rem', borderRadius: '8px', border: brutalBorder, fontWeight: 900, boxShadow: brutalShadow, zIndex: 1000, whiteSpace: 'nowrap' }}>{toast}</div>}
      <style>{`
        .brutal-btn { cursor: pointer; transition: all 0.1s ease-out; }
        .brutal-btn:active { transform: translate(4px, 4px) !important; box-shadow: 0px 0px 0px ${colors.text} !important; }
        .nav-btn { cursor: pointer; transition: all 0.1s ease-out; }
        .nav-btn:active { transform: scale(0.95); }
        div::-webkit-scrollbar { display: none; }
        * { box-sizing: border-box; }
        input[type="number"]::-webkit-inner-spin-button, input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      `}</style>
    </div>
  )
}