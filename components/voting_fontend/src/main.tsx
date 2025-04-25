import '@mysten/dapp-kit/dist/index.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getFullnodeUrl } from '@mysten/sui/client'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { BrowserRouter, Routes, Route, createBrowserRouter, RouterProvider } from 'react-router';
import CreateProposal from './pages/proposal/create/create.tsx';
import { EventDetail } from './pages/index.ts';
import WalletState from './logics/wallet_state.tsx';


const queryClient = new QueryClient();
const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  localnet: { url: getFullnodeUrl('localnet') },
  devnet: {url: getFullnodeUrl('devnet')}
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/create_proposal",
    element: <CreateProposal />,
  },
  {
    path: "/event_detail",
    element: <EventDetail/>
  },
  {
    path: "/show_all_objects",
    element: <WalletState/>
    
  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networks} defaultNetwork='testnet'>
          <WalletProvider autoConnect>
            <RouterProvider router={router}/>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
  </StrictMode>,
)
