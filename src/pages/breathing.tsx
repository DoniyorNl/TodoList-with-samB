import { BoxBreathing } from '@/components/breathing/BoxBreathing'
import { useUserState } from '@/stores/user.store'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

/**
 * Box Breathing page — 4-4-4-4 breathing exercise
 * Dark focus-friendly background, pink/purple accent
 */
export default function Breathing() {
	const { user } = useUserState()
	const navigate = useNavigate()

	useEffect(() => {
		if (!user) {
			navigate('/')
		}
	}, [user, navigate])

	if (!user) {
		return null
	}

	return (
		<div
			className="min-h-screen w-full bg-background pt-[10vh] pb-12"
			style={{ minHeight: '100dvh' }}
		>
			<div className="mx-auto max-w-lg px-4">
				<div className="mb-6 flex items-center justify-between">
					<Link to="/dashboard">
						<Button variant="ghost" size="sm">
							← Back
						</Button>
					</Link>
					<h1 className="text-lg font-semibold text-foreground">Box Breathing</h1>
					<div className="w-14" />
				</div>

				<p className="mb-8 text-center text-sm text-muted-foreground">
					Inhale 4s · Hold 4s · Exhale 4s · Hold 4s. Reduce stress and focus.
				</p>

				<BoxBreathing />
			</div>
		</div>
	)
}
