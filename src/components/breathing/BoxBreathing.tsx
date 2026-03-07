import {
	DEFAULT_ROUNDS,
	MAX_ROUNDS,
	MIN_ROUNDS,
} from '@/constants/breathing.constants'
import { useBoxBreathing } from '@/hooks/useBoxBreathing'
import { BreathingControls } from './BreathingControls'
import { BreathingDot } from './BreathingDot'
import { BreathingStats } from './BreathingStats'

const PHASE_LABELS = ['Inhale', 'Hold', 'Exhale', 'Hold']

export function BoxBreathing() {
	const {
		isRunning,
		phaseLabel,
		countdown,
		roundNumber,
		totalRounds,
		cycleProgress,
		isInfinite,
		start,
		pause,
		reset,
		setRounds,
		setInfinite,
	} = useBoxBreathing({ rounds: DEFAULT_ROUNDS })

	return (
		<div className="flex flex-col items-center gap-8">
			<BreathingStats />

			{/* Square + countdown + dot */}
			<div className="relative">
				{/* Outer square */}
				<div
					className="relative h-[280px] w-[280px] rounded-lg border-2 border-primary/40 bg-primary/5"
					aria-hidden
				>
					{/* Phase labels on sides */}
					<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm font-medium text-primary/90">
						{PHASE_LABELS[0]}
					</div>
					<div className="absolute -right-6 top-1/2 -translate-y-1/2 text-sm font-medium text-primary/90">
						{PHASE_LABELS[1]}
					</div>
					<div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-sm font-medium text-primary/90">
						{PHASE_LABELS[2]}
					</div>
					<div className="absolute -left-6 top-1/2 -translate-y-1/2 text-sm font-medium text-primary/90">
						{PHASE_LABELS[3]}
					</div>

					{/* Moving dot — one full loop every 16s, in sync with phases */}
					<BreathingDot progress={cycleProgress} />
				</div>

				{/* Center countdown */}
				<div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
					<span
						className="text-6xl font-bold tabular-nums text-foreground"
						aria-live="polite"
						aria-atomic="true"
					>
						{countdown}
					</span>
					<span className="mt-1 text-sm font-medium text-primary/90">{phaseLabel}</span>
					<span className="mt-0.5 text-xs text-muted-foreground">
						{isInfinite ? `Round ${roundNumber} · Infinite` : `Round ${roundNumber} / ${totalRounds}`}
					</span>
				</div>
			</div>

			<BreathingControls
				isRunning={isRunning}
				onStart={start}
				onPause={pause}
				onReset={reset}
			/>

			{/* Rounds / Infinite */}
			<div className="flex flex-wrap items-center justify-center gap-4">
				<label className="flex cursor-pointer items-center gap-2">
					<input
						type="checkbox"
						checked={isInfinite}
						onChange={e => setInfinite(e.target.checked)}
						disabled={isRunning}
						className="h-4 w-4 rounded border-border"
					/>
					<span className="text-sm text-muted-foreground">Infinite (until you stop)</span>
				</label>
				{!isInfinite && (
					<div className="flex items-center gap-2">
						<label className="text-sm text-muted-foreground">Rounds</label>
						<select
							value={totalRounds}
							onChange={e => setRounds(Number(e.target.value))}
							disabled={isRunning}
							className="rounded-md border border-border bg-card px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
						>
							{Array.from({ length: MAX_ROUNDS - MIN_ROUNDS + 1 }, (_, i) => MIN_ROUNDS + i).map(
								n => (
									<option key={n} value={n}>
										{n}
									</option>
								),
							)}
						</select>
					</div>
				)}
			</div>
		</div>
	)
}
