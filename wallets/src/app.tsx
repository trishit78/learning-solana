import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { clusterApiUrl } from '@solana/web3.js'
import { useMemo } from 'react'

import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import {  Link, Route, Routes } from 'react-router'
import Home from './myComponents/Home'

import { BalanceDisplay } from './myComponents/BalanceDisplay'
import { WalletPage } from './myComponents/WalletPage'

export function App() {
  const endpoint = clusterApiUrl('devnet')
  const wallets = useMemo(() => [], [])

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets}>
        <WalletModalProvider>
            <nav>
              <Link to="/">Home</Link> | <Link to="/wallet">Wallet</Link>| <Link to="/balance">Balance</Link>
            </nav>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/wallet" element={<WalletPage />} />
              <Route path="/balance" element={<BalanceDisplay />} />
            </Routes>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
