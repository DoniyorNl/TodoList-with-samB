import { navLinks } from '@/constants'
import { useUserState } from '@/stores/user.store'
import { Link } from 'react-router-dom'
import { useTheme } from '../providers/theme-provider'
import { Button } from '../ui/button'
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
						<a key={link.path} href={link.path} className='font-medium hover:underline'>
							{link.label}
						</a>
					))}
					<ThemeToggle />
					{user ? (
						<UserBox />
					) : (
						<Link to={'/'}>
							<Button variant={'secondary'} className='bg-gray-300'>
								Join free
							</Button>
						</Link>
					)}
				</div>
			</div>
		</div>
	)
}
