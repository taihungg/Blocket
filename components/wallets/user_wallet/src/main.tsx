import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { ZKLoginProvider } from 'react-sui-zk-login-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WalletProvider } from '@mysten/dapp-kit';
import { SuiClientProvider } from '@mysten/dapp-kit';
import { BrowserRouter } from 'react-router-dom';

const suiclient = new SuiClient({
  url: getFullnodeUrl(
    'devnet'
  )
})
const queryClient = new QueryClient();
const networks = {
  devnet: { url: getFullnodeUrl('devnet') }
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork="devnet">
        <WalletProvider>
          {/* <ZKLoginProvider client={suiclient}> */}
          <BrowserRouter>
            <App />
          </BrowserRouter>
          {/* </ZKLoginProvider> */}
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode>,
)
