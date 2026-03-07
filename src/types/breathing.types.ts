export type Phase = 'inhale' | 'hold-in' | 'exhale' | 'hold-out'

export const PHASE_ORDER: Phase[] = ['inhale', 'hold-in', 'exhale', 'hold-out']

export interface BreathingSession {
	id?: string
	rounds: number
	duration: number // total seconds
	completedAt: Date
	userId: string
}

export interface BreathingConfig {
	rounds: number
}
