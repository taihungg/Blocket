import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getFullnodeUrl } from '@mysten/sui/client';
import { SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App.tsx';
import NotFound from './pages/NotFount/Notfount.tsx';
import {
  SellTicket,
  Collection,
  CreateEvent,
  Swap,
  EventDetail,
  BuyTicket,
  Marketplace,
} from './pages/index.ts';
import '@mysten/dapp-kit/dist/index.css';
import './index.css';


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
    path: "/event_detail/:id",
    element: <EventDetail />
  },
  {
    path: '/swap',
    element: <Swap />
  },
  {
    path: '/market',
    element: <Marketplace />
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
  {
    path: '/buy_ticket',
    element: <BuyTicket />
  },
])

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