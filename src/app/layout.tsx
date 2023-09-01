"use client";
// import "./globals.css";
import { Inter } from "next/font/google";
import { WagmiConfig, createConfig, configureChains } from 'wagmi'
import { sepolia, taikoTestnetSepolia, baseGoerli, foundry, polygon, optimism, mainnet } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'


const inter = Inter({ subsets: ["latin"] });
const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia, taikoTestnetSepolia, baseGoerli, foundry, mainnet],
  [publicProvider()],
)
const config = createConfig({
  autoConnect: true,
  publicClient,
  webSocketPublicClient,
})

// export const metadata = {
//   title: "TransWeb3",
//   description: "A starter Next.js repository for Sismo Connect offchain apps",
// };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <WagmiConfig config={config}>
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
    </WagmiConfig>
  );
}
