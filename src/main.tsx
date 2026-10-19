import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { SpotifyApp } from './SpotifyApp.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpotifyApp />
  </StrictMode>,
)