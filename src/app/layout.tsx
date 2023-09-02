"use client";

import { Layout } from "antd";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });


import '@rainbow-me/rainbowkit/styles.css';
import {
  Chain,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  polygonZkEvmTestnet,
  lineaTestnet,
  polygonMumbai,
  sepolia
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const taikoGrimsvotnL2: Chain = {
  id: 167005,
  name: 'Taiko Grimsvotn L2',
  network: 'taikoGrimsvotnL2',
  iconUrl: 'data:image/png;base64,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', // You should replace this with the actual URL
  iconBackground: '#fff', // Replace with the actual background color if different
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://rpc.test.taiko.xyz'] },
    default: { http: ['https://rpc.test.taiko.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Taiko Explorer', url: 'https://explorer.test.taiko.xyz' },
    etherscan: { name: 'Taiko Explorer', url: 'https://explorer.test.taiko.xyz' }, // Change this if there is another block explorer
  },
  contracts: {
    // Add any specific contracts here. For example,
    // multicall3: {
    //   address: '0x...',
    //   blockCreated: ...,
    // },
  },
  testnet: true, // Assuming this is a testnet
};

const taikoEldfellL3: Chain = {
  id: 167006,
  name: 'Taiko Eldfell L3',
  network: 'taikoEldfellL3',
  iconUrl: 'data:image/png;base64,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', // You should replace this with the actual URL
  iconBackground: '#fff', // Replace with the actual background color if different
  nativeCurrency: {
    decimals: 18,
    name: 'Ethereum',
    symbol: 'ETH',
  },
  rpcUrls: {
    public: { http: ['https://rpc.l3test.taiko.xyz'] },
    default: { http: ['https://rpc.l3test.taiko.xyz'] },
  },
  blockExplorers: {
    default: { name: 'Taiko Explorer', url: 'https://explorer.l3test.taiko.xyz' },
    etherscan: { name: 'Taiko Explorer', url: 'https://explorer.l3test.taiko.xyz' }, // Change this if there is another block explorer
  },
  contracts: {
    // Add any specific contracts here. For example,
    // multicall3: {
    //   address: '0x...',
    //   blockCreated: ...,
    // },
  },
  testnet: true, // Assuming this is a testnet
};



const { chains, publicClient } = configureChains(
  [mainnet, polygon, lineaTestnet, polygonMumbai, polygonZkEvmTestnet, sepolia, taikoGrimsvotnL2, taikoEldfellL3],
  [
    // alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: 'fa0299fd2403dabc8f5135b2674eeed1',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Layout>
          {children}
        </Layout>
        </RainbowKitProvider>
        </WagmiConfig>
      </body>
    </html>
  );
}