import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { ZKLoginProvider } from 'react-sui-zk-login-kit';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { WalletProvider } from '@mysten/dapp-kit';
import { SuiClientProvider } from '@mysten/dapp-kit';

const suiclient = new SuiClient({
  url: getFullnodeUrl(
    'devnet'
  )
})
const queryClient = new QueryClient();
const networks = {
  devnet: {url: getFullnodeUrl('devnet')}
}
createRoot(document.getElementById('root')!).render(
  <StrictMode>

    <ZKLoginProvider client={suiclient}>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networks} defaultNetwork="devnet">
          <WalletProvider>
            <App />
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </ZKLoginProvider>
  </StrictMode>,
)
