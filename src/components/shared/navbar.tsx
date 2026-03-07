import { navLinks } from '@/constants'
import { useUserState } from '@/stores/user.store'
import { Link } from 'react-router-dom'
import { useTheme } from '../providers/theme-provider'
import { Button } from '../ui/button'
import RestMenu from './restMenu'
import { ThemeToggle } from './themeToggle'
import UserBox from './userBox'

export default function Navbar() {
	const { user } = useUserState()
	const { theme } = useTheme()

	return (
		<div className='w-full h-[10vh] border-b fixed inset-0 z-50 bg-background'>
			<div className='container max-w-6xl mx-auto h-full flex justify-between items-center'>
				<Link to={'/home'} className='flex items-center'>
					<img
						src={theme === 'dark' ? '/logodark.png' : '/logolight.png'}
						alt='Plan Logo'
						className='h-16 w-auto object-contain'
					/>
				</Link>
				<div className='flex items-center gap-3'>
					{navLinks.map(link => (
						<Link
							key={link.path}
							to={link.path}
							className='font-medium hover:underline'
						>
							{link.label}
						</Link>
					))}
					<RestMenu />
					<ThemeToggle />
					{user ? (
						<UserBox />
					) : (
						<Link to={'/'}>
							<Button variant='secondary'>
								Join free
							</Button>
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}
