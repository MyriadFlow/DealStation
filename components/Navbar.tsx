import React, { useState } from 'react'
import {
	CNavbar,
	CContainer,
	CNavbarToggler,
	CNavbarBrand,
	CCollapse,
	CNavbarNav,
	CNavItem,
	CNavLink,
	CForm,
} from '@coreui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

const Navbar = () => {
	const [visible, setVisible] = useState(false)
	return (
		<>
			<CNavbar expand='lg' colorScheme='dark' className='bg-dark'>
				<CContainer fluid>
					<CNavbarBrand href='#'>DealStation</CNavbarBrand>
					<CNavbarToggler onClick={() => setVisible(!visible)} />
					<CCollapse className='navbar-collapse' visible={visible}>
						<CNavbarNav>
							<CNavItem>
								<Link href={'/profile'}>Profile</Link>
							</CNavItem>
						</CNavbarNav>
					</CCollapse>
					<CForm className='d-flex justify-content-end'>
						<ConnectButton />
					</CForm>
				</CContainer>
			</CNavbar>
		</>
	)
}

export default Navbar
