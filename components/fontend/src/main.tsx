import '@mysten/dapp-kit/dist/index.css';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { getFullnodeUrl } from '@mysten/sui/client'
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit'
import { createBrowserRouter, RouterProvider } from 'react-router';
import CreateProposal from './pages/proposal/create/create.tsx';
import { EventDetail } from './pages/index.ts';
import WalletState from './logics/wallet_state.tsx';
import { UserWallet } from './components/index.ts';
import Swap from './pages/swap/swap.tsx';
import Exchange from './pages/exchange/exchange.tsx';
import CreateEvent from './pages/event/create.tsx';
import NotFound from './pages/NotFount/Notfount.tsx';
import Collection from './pages/collection/collection.tsx';
import MaketPlace from './pages/maketplace/maketplace.tsx';
import SellTicket from './pages/sellTicket/sellTicket.tsx';


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
    path: '/swap',
    element: <Swap />
  },
  {
    path: '/maket_place',
    element: <MaketPlace />
  },
  {
    path: '/sell_ticket',
    element: <SellTicket />
  },
  {
    path: '/settings',
    element: <NotFound />
  },
  {
    path: '/event_create',
    element: <CreateEvent />
  },
  {
    path: '/collection',
    element: <Collection />
  },
])

const PACKAGE_ID="0xa3d0a8ea1a38276eb0e832097c4a455b6c9ca92929906c3a8ce3976c29ff4452"
const POOL_TICK="0xccdd18d7af2e2a4f26ad2f41a80ef93e94f85225c10c8d66903003a01122483b"
createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networks} defaultNetwork='testnet'>
        <WalletProvider autoConnect>
          <RouterProvider router={router} />
        </WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  // </StrictMode>,
)
export {PACKAGE_ID as pack, POOL_TICK as pool}