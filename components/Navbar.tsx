import { AppstoreOutlined, MailOutlined, BugOutlined } from '@ant-design/icons'

import { Menu } from 'antd'
import React, { useState } from 'react'

const items = [
	{
		label: 'Explore',
		key: 'mail',
		icon: <MailOutlined />,
	},
	{
		label: 'New Listing',
		key: 'app',
		icon: <AppstoreOutlined />,
	},
	{
		label: 'My NFTs',
		key: 'app',
		icon: <BugOutlined />,
	},
]

const Navbar = () => {
	const [current, setCurrent] = useState('mail')

	const onClick = (e: any) => {
		console.log('click ', e)
		setCurrent(e.key)
	}
	return (
		<Menu
			// onClick={onClick}
			selectedKeys={[current]}
			mode='horizontal'
			items={items}
			theme={'dark'}
		/>
	)
}

export default Navbar
