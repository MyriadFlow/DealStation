import Head from 'next/head'
import Navbar from './Navbar'

type Props = {
	children: React.ReactNode
}

const Layout = ({ children }: Props) => {
	return (
		<>
			<Head>
				<title>MyriadFlow</title>
				<meta
					name='description'
					content='Swap nfts with MyriadFlow dealstation'
				/>
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Navbar />
			{children}
		</>
	)
}

export default Layout
