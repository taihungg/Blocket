import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { ZKLoginProvider } from 'react-sui-zk-login-kit';

const suiclient = new SuiClient({
  url: getFullnodeUrl(
    'devnet'
  )
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ZKLoginProvider client={suiclient}>
      <App />
    </ZKLoginProvider>
  </StrictMode>,
)
