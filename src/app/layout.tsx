"use client";

import { Layout } from "antd";
import { Inter } from "next/font/google";
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { sepolia, taikoTestnetSepolia, baseGoerli, foundry, polygon, optimism, mainnet } from 'wagmi/chains'

import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'


const inter = Inter({ subsets: ["latin"] });
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, taikoTestnetSepolia, baseGoerli, foundry, mainnet],
  [publicProvider()],
)
const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: 'wagmi',
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        projectId: '...',
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: 'Injected',
        shimDisconnect: true,
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
    <html lang="en">
      <body className={inter.className}>
        <Layout>
          {children}
        </Layout>
      </body>
    </html>
    </WagmiConfig>
  );
}
