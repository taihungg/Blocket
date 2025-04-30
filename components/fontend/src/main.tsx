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
import { UserWallet } from './components/index.ts';
import Swap from './pages/swap/swap.tsx';
import Exchange from './pages/exchange/exchange.tsx';


const queryClient = new QueryClient();
const networks = {
  testnet: { url: getFullnodeUrl('testnet') },
  localnet: { url: getFullnodeUrl('localnet') },
  devnet: { url: getFullnodeUrl('devnet') }
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
    path: "/event_detail/:id",
    element: <EventDetail />
  },
  {
    path: "/show_all_objects",
    element: <WalletState />

  },
  {
    path: '/my_wallet',
    element: <UserWallet />
  },
  {
    path: '/buy_tick_token',
    element: <Swap />
  },
  {
    path: '/exchange',
    element: <Exchange />
  }
])
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork='testnet'>
        <WalletProvider autoConnect>
          <RouterProvider router={router} />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  </StrictMode>,
)
