import Login from '@/components/auth/login'
import Register from '@/components/auth/register'
import SocialMedia from '@/components/auth/socialMedia'
import { Card } from '@/components/ui/card'
import { useAuthState } from '@/stores/auth.store'

export default function Auth() {
	const { authState } = useAuthState()
	return (
		<>
			<div className='flex min-h-screen w-full items-center justify-center bg-background p-4'>
				<Card className='relative w-full max-w-md p-6 shadow-lg'>
					{authState === 'login' && <Login />}
					{authState === 'register' && <Register />}
					<SocialMedia />
				</Card>
			</div>
		</>
	)
}
