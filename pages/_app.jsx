import '@/styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import '@coreui/coreui/dist/css/coreui.min.css'
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import {
	mainnet,
	polygonMumbai,
	polygon,
	optimism,
	arbitrum,
	zora,
} from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import Layout from '@/components/Layout'

const { chains, publicClient } = configureChains(
	[mainnet, polygonMumbai, polygon, optimism, arbitrum, zora],
	[alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
)
const { connectors } = getDefaultWallets({
	appName: 'Myraid Flow',
	projectId: 'd50d12ce56fee72d9ec4cafb51cb2e13',
	chains,
})

export const wagmiConfig = createConfig({
	autoConnect: true,
	connectors,
	publicClient,
})

export default function App({ Component, pageProps }) {
	return (
		<WagmiConfig config={wagmiConfig}>
			<RainbowKitProvider chains={chains}>
				<Layout>
					<Component {...pageProps} />
				</Layout>
			</RainbowKitProvider>
		</WagmiConfig>
	)
}
