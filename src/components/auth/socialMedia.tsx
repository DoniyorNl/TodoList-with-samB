import { auth } from '@/firebase/fb_init'
import { GithubAuthProvider, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { useState } from 'react'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import Loader from '../shared/loader'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'

export default function SocialMedia() {
	const navigate = useNavigate()
	const [loading, setLoading] = useState(false)

	const onGoogle = () => {
		setLoading(true)
		const googleProvider = new GoogleAuthProvider()
		signInWithPopup(auth, googleProvider)
			.then(() => {
				navigate('/dashboard')
			})
			.catch(() => {
				toast.error('Google login failed. Please try again.')
			})
			.finally(() => {
				setLoading(false)
			})
	}
	const onGithub = () => {
		setLoading(true)
		const githubProvider = new GithubAuthProvider()
		signInWithPopup(auth, githubProvider)
			.then(() => {
				navigate('/dashboard')
			})
			.catch(() => {
				toast.error('GitHub login failed. Please try again.')
			})
			.finally(() => {
				setLoading(false)
			})
	}
	return (
		<>
			{loading && <Loader />}
			<Separator className='my-3' />
			<div className='grid grid-cols-2 gap-3'>
				<Button onClick={onGithub} disabled={loading}>
					<FaGithub />
					<span>Sign in with Github</span>
				</Button>
				<Button onClick={onGoogle} disabled={loading}>
					<FaGoogle />
					<span>Sign in with Google</span>
				</Button>
			</div>
		</>
	)
}
