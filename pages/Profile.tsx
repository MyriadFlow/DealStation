import { useState } from 'react'
import { CNav, CNavItem, CNavLink, CTabContent, CTabPane } from '@coreui/react'
import { usernfts } from '@/utils/data'
import NftCard from '@/components/NftCard'
import Offerlist from '@/components/Offerlist'

const Profile = () => {
	const [activeKey, setActiveKey] = useState(1)
	return (
		<section
			className='profile
		'
		>
			<CNav variant='tabs' role='tablist'>
				<CNavItem role='presentation'>
					<CNavLink
						active={activeKey === 1}
						component='button'
						role='tab'
						aria-controls='home-tab-pane'
						aria-selected={activeKey === 1}
						onClick={() => setActiveKey(1)}
					>
						Nfts
					</CNavLink>
				</CNavItem>
				<CNavItem role='presentation'>
					<CNavLink
						active={activeKey === 2}
						component='button'
						role='tab'
						aria-controls='profile-tab-pane'
						aria-selected={activeKey === 2}
						onClick={() => setActiveKey(2)}
					>
						Offers
					</CNavLink>
				</CNavItem>
				<CNavItem role='presentation'>
					<CNavLink
						active={activeKey === 3}
						component='button'
						role='tab'
						aria-controls='profile-tab-pane'
						aria-selected={activeKey === 3}
						onClick={() => setActiveKey(3)}
					>
						Trades
					</CNavLink>
				</CNavItem>
			</CNav>
			<CTabContent>
				<CTabPane
					role='tabpanel'
					aria-labelledby='home-tab-pane'
					visible={activeKey === 1}
				>
					<div className='nft-list'>
						{usernfts.map((nft, index) => (
							<NftCard key={index} {...nft} />
						))}
					</div>
				</CTabPane>
				<CTabPane
					role='tabpanel'
					aria-labelledby='profile-tab-pane'
					visible={activeKey === 2}
				>
					<Offerlist />
				</CTabPane>
				<CTabPane
					role='tabpanel'
					aria-labelledby='profile-tab-pane'
					visible={activeKey === 3}
				>
					initiated
				</CTabPane>
			</CTabContent>
		</section>
	)
}

export default Profile
