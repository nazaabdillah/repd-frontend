'use client'

import { useSignIn } from '@clerk/nextjs'

export default function LoginPage() {
  const { signIn, isLoaded } = useSignIn()

    async function signInWithGoogle() {
    console.log('button clicked')
    if (!isLoaded) {
        console.log('not loaded yet')
        return
    }
    console.log('isLoaded:', isLoaded)
    console.log('signIn:', signIn)
    try {
        await signIn.authenticateWithRedirect({
        strategy: 'oauth_google',
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/',
        })
    } catch (err) {
        console.error('OAuth error:', err)
    }
    }

  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #050d2e 0%, #0a1a5c 100%)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: '380px',
        margin: '0 1rem',
        borderRadius: '24px',
        padding: '2.5rem 2rem',
        textAlign: 'center',
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(24px)',
        border: '1px solid rgba(255,255,255,0.18)',
        boxShadow: '0 8px 48px rgba(0,0,0,0.35)',
      }}>
        <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: '4px' }}>
          REP<span style={{ color: '#a8c4ff' }}>D</span>
        </h1>
        <p style={{ color: 'rgba(168,196,255,0.6)', fontSize: '0.7rem', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '4px' }}>
          No Equipment V-Taper
        </p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginBottom: '2rem' }}>
          by Gerry
        </p>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', marginBottom: '2rem' }} />

        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
          Lacak setiap set & progress kamu. Data tersimpan di cloud — akses dari mana saja.
        </p>

        <button
          onClick={signInWithGoogle}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            background: 'white',
            color: '#1a1a2e',
            border: 'none',
            borderRadius: '16px',
            padding: '14px 20px',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/>
            <path fill="#34A853" d="M12.255 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09C3.515 21.3 7.565 24 12.255 24z"/>
            <path fill="#FBBC05" d="M5.525 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"/>
            <path fill="#EA4335" d="M12.255 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C18.205 1.19 15.495 0 12.255 0c-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/>
          </svg>
          Masuk dengan Google
        </button>

        <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', marginTop: '1.5rem' }}>
          Data kamu aman & tersimpan di cloud
        </p>
      </div>
    </main>
  )
}