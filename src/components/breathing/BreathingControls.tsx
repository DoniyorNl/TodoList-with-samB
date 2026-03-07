import { Button } from '@/components/ui/button'
import { Pause, Play, RotateCcw } from 'lucide-react'

interface BreathingControlsProps {
	isRunning: boolean
	onStart: () => void
	onPause: () => void
	onReset: () => void
}

export function BreathingControls({
	isRunning,
	onStart,
	onPause,
	onReset,
}: BreathingControlsProps) {
	return (
		<div className="flex items-center justify-center gap-3">
			{!isRunning ? (
				<Button size="lg" onClick={onStart}>
					<Play className="mr-2 h-5 w-5" />
					Start
				</Button>
			) : (
				<Button size="lg" variant="outline" onClick={onPause}>
					<Pause className="mr-2 h-5 w-5" />
					Pause
				</Button>
			)}
			<Button
				size="lg"
				variant="ghost"
				onClick={onReset}
				className="text-muted-foreground hover:text-foreground"
			>
				<RotateCcw className="mr-2 h-5 w-5" />
				Reset
			</Button>
		</div>
	)
}
