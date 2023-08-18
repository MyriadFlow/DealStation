import Head from 'next/head'

import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Image from 'next/image'
import { nfts } from '@/utils/data'
import Card from '@/components/Card'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
	return (
		<main className={`${styles.main} ${inter.className}`}>
			<section className='hero'>
				<div>
					<h1>Discover & Collect Super Rare Digital Artworks</h1>
					<p>
						The largest NFT marketplace. Authentic and truly unique digital
						creation. Signed and issued by the creator, made possible by
						blockchain technology
					</p>
				</div>
				<div className='hero-image'>
					<Image src='/image-1.png' alt='hero nft' width={300} height={300} />
				</div>
			</section>
			<section className='nft-listing'>
				<div>
					<h2>Trending This Week</h2>
					<p>
						Various kinds of Artwork categories that are trending this week. The
						trend will be reset every week. Don’t miss out on the best artworks
						every week
					</p>
				</div>
				<div className='cards'>
					{nfts.map((nft, index) => (
						<Card
							key={index}
							name={nft.name}
							image={nft.image}
							handle={nft.handle}
							price={nft.price}
						/>
					))}
				</div>
			</section>
			<ConnectButton />
		</main>
	)
}
