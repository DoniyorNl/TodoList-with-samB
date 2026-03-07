/**
 * Dot that moves along the square: top → right → bottom → left
 * progress 0..1
 */
interface BreathingDotProps {
	progress: number
	className?: string
}

export function BreathingDot({ progress, className = '' }: BreathingDotProps) {
	// Perimeter: each side 25% (0–0.25, 0.25–0.5, 0.5–0.75, 0.75–1)
	const side = Math.floor(progress * 4) % 4
	const t = (progress * 4) % 1

	let x: number
	let y: number

	switch (side) {
		case 0:
			x = t
			y = 0
			break
		case 1:
			x = 1
			y = t
			break
		case 2:
			x = 1 - t
			y = 1
			break
		default:
			x = 0
			y = 1 - t
	}

	const left = `${x * 100}%`
	const top = `${y * 100}%`

	return (
		<div
			className={`absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-lg shadow-primary/30 transition-all duration-1000 ease-linear ${className}`}
			style={{ left, top }}
			aria-hidden
		/>
	)
}
