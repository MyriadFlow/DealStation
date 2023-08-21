import Image from 'next/image'
import { CButton } from '@coreui/react'

type Props = {}

const Offerlist = (props: Props) => {
	return (
		<div className='offer-list'>
			<div>
				<Image src='/nft-1.png' alt='offerlist' width={100} height={100} />
				<p>trading offer for</p>
				<Image src='/nft-1.png' alt='offerlist' width={100} height={100} />
			</div>
			<div>
				<CButton color='primary'>Accept</CButton>
				<CButton color='danger'>Cancel</CButton>
			</div>
		</div>
	)
}

export default Offerlist
