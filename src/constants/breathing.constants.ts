/**
 * Box breathing: Inhale 4s → Hold 4s → Exhale 4s → Hold 4s
 * One full cycle = 16 seconds
 */
export const PHASE_DURATIONS = [4, 4, 4, 4] as const // seconds per phase

export const PHASE_NAMES = ['Inhale', 'Hold', 'Exhale', 'Hold'] as const

export const TOTAL_CYCLE_SECONDS = PHASE_DURATIONS.reduce((a, b) => a + b, 0) // 16

export const DEFAULT_ROUNDS = 4

export const MIN_ROUNDS = 1
export const MAX_ROUNDS = 10
