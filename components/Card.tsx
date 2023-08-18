import { nftType } from '@/types'
import Image from 'next/image'

const Card = ({ image, name, handle, price }: nftType) => {
	return (
		<div className='card'>
			<Image
				src={image}
				alt='nft image'
				className='card-image'
				height={200}
				width={300}
			/>
			<div className='card-details'>
				<div>
					<h3>{name}</h3>
					<span>{handle}</span>
					<h4>{price}</h4>
				</div>
				<button className='btn'>offer</button>
			</div>
		</div>
	)
}

export default Card
