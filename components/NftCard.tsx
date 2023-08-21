import { nftCardType } from '@/types'
import Image from 'next/image'

const NftCard = ({ name, image, price }: nftCardType) => {
	return (
		<div className='nft-card'>
			<Image src={image} alt={name} height={250} width={250} />
			<div>
				<h3>{name}</h3>
				<h4>{price}</h4>
			</div>
		</div>
	)
}

export default NftCard
