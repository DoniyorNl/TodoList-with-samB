import { Button } from '@/components/ui/button'
import { usePomodoro } from '@/hooks/usePomodoro'
import { useUserState } from '@/stores/user.store'
import { Pause, Play, RotateCcw } from 'lucide-react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function formatTime(seconds: number) {
	const m = Math.floor(seconds / 60)
	const s = seconds % 60
	return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}

const PHASE_LABELS: Record<'work' | 'short-break' | 'long-break', string> = {
	work: 'Focus',
	'short-break': 'Short break',
	'long-break': 'Long break',
}

export default function Pomodoro() {
	const { user } = useUserState()
	const navigate = useNavigate()
	const { phase, timeLeft, isRunning, pomodoroCount, start, pause, reset, resetToWork } =
		usePomodoro()

	useEffect(() => {
		if (!user) navigate('/')
	}, [user, navigate])

	if (!user) return null

	return (
		<div
			className='min-h-screen w-full bg-background pt-[10vh] pb-12'
			style={{ minHeight: '100dvh' }}
		>
			<div className='mx-auto max-w-lg px-4'>
				<div className='mb-6 flex items-center justify-between'>
					<Link to='/dashboard'>
						<Button variant='ghost' size='sm'>
							← Back
						</Button>
					</Link>
					<h1 className='text-lg font-semibold text-foreground'>Pomodoro</h1>
					<div className='w-14' />
				</div>

				<p className='mb-8 text-center text-sm text-muted-foreground'>
					25 min focus · 5 min short break · 15 min long break
				</p>

				<div className='flex flex-col items-center gap-8'>
					<div className='rounded-xl border border-border bg-card px-8 py-6 shadow-sm'>
						<p className='mb-2 text-center text-sm font-medium text-muted-foreground'>
							{PHASE_LABELS[phase]}
						</p>
						<p
							className='text-6xl font-bold tabular-nums text-foreground'
							aria-live='polite'
						>
							{formatTime(timeLeft)}
						</p>
						{pomodoroCount > 0 && phase === 'work' && (
							<p className='mt-2 text-center text-xs text-muted-foreground'>
								Session {pomodoroCount} / 4
							</p>
						)}
					</div>

					<div className='flex items-center justify-center gap-3'>
						{!isRunning ? (
							<Button size='lg' onClick={start}>
								<Play className='mr-2 h-5 w-5' />
								Start
							</Button>
						) : (
							<Button size='lg' variant='outline' onClick={pause}>
								<Pause className='mr-2 h-5 w-5' />
								Pause
							</Button>
						)}
						<Button
							size='lg'
							variant='ghost'
							onClick={reset}
							className='text-muted-foreground hover:text-foreground'
						>
							<RotateCcw className='mr-2 h-5 w-5' />
							Reset
						</Button>
						<Button
							size='lg'
							variant='ghost'
							onClick={resetToWork}
							className='text-muted-foreground hover:text-foreground'
						>
							New session
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
