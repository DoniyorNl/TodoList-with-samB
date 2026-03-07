import { auth, db } from '@/firebase/fb_init'
import {
	DEFAULT_ROUNDS,
	MAX_ROUNDS,
	MIN_ROUNDS,
	PHASE_DURATIONS,
	TOTAL_CYCLE_SECONDS,
} from '@/constants/breathing.constants'
import { PHASE_ORDER, type Phase } from '@/types/breathing.types'
import { addDoc, collection } from 'firebase/firestore/lite'
import { useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export interface UseBoxBreathingOptions {
	rounds?: number
	onComplete?: () => void
}

export interface UseBoxBreathingReturn {
	isRunning: boolean
	currentPhase: Phase
	phaseLabel: string
	countdown: number
	roundNumber: number
	totalRounds: number
	/** 0..1 over full session (for optional UI) */
	progress: number
	/** 0..1 per 16s cycle — use this for dot animation so it matches timing */
	cycleProgress: number
	/** Infinite mode: no round limit, runs until user stops */
	isInfinite: boolean
	start: () => void
	pause: () => void
	reset: () => void
	setRounds: (n: number) => void
	setInfinite: (value: boolean) => void
}

const PHASE_LABELS: Record<Phase, string> = {
	inhale: 'Inhale',
	'hold-in': 'Hold',
	exhale: 'Exhale',
	'hold-out': 'Hold',
}

export function useBoxBreathing(
	options: UseBoxBreathingOptions = {},
): UseBoxBreathingReturn {
	const { rounds: initialRounds = DEFAULT_ROUNDS, onComplete } = options

	const [totalRounds, setTotalRounds] = useState(
		Math.max(MIN_ROUNDS, Math.min(MAX_ROUNDS, initialRounds)),
	)
	const [isRunning, setIsRunning] = useState(false)
	const [isInfinite, setIsInfinite] = useState(false)
	const [roundNumber, setRoundNumber] = useState(1)
	const [phaseIndex, setPhaseIndex] = useState(0)
	const [countdown, setCountdown] = useState<number>(PHASE_DURATIONS[0])

	const queryClient = useQueryClient()

	const currentPhase = PHASE_ORDER[phaseIndex]
	const phaseLabel = PHASE_LABELS[currentPhase]

	// Elapsed in current cycle (0..16 seconds)
	const elapsedInCycle =
		phaseIndex * 4 + (PHASE_DURATIONS[phaseIndex] - countdown)
	// 0..1 every 16 seconds — dot does one full loop per cycle
	const cycleProgress = elapsedInCycle / TOTAL_CYCLE_SECONDS

	const totalSecondsElapsed =
		(roundNumber - 1) * TOTAL_CYCLE_SECONDS + elapsedInCycle
	const totalSessionSeconds = isInfinite ? Infinity : totalRounds * TOTAL_CYCLE_SECONDS
	const progress =
		!isInfinite && totalSessionSeconds > 0
			? totalSecondsElapsed / totalSessionSeconds
			: 0

	const start = useCallback(() => setIsRunning(true), [])
	const pause = useCallback(() => {
		setIsRunning(false)
		// When pausing in infinite mode, save completed rounds so far
		if (stateRef.current.isInfinite) {
			const r = stateRef.current.roundNumber
			const completedRounds = r > 0 ? r - 1 : 0
			const uid = auth.currentUser?.uid
			if (uid && completedRounds > 0) {
				const duration = completedRounds * TOTAL_CYCLE_SECONDS
				addDoc(
					collection(db, 'users', uid, 'breathing_sessions'),
					{
						rounds: completedRounds,
						duration,
						completedAt: new Date(),
						userId: uid,
					},
				)
					.then(() => {
						toast.success(`Saved ${completedRounds} rounds`)
						queryClient.invalidateQueries({ queryKey: ['breathing-week'] })
						queryClient.invalidateQueries({ queryKey: ['breathing-sessions-today'] })
						queryClient.invalidateQueries({ queryKey: ['breathing-sessions-week'] })
					})
					.catch(() => {})
			}
		}
	}, [queryClient])

	const reset = useCallback(() => {
		setIsRunning(false)
		setRoundNumber(1)
		setPhaseIndex(0)
		setCountdown(PHASE_DURATIONS[0])
	}, [])

	const setRounds = useCallback((n: number) => {
		setTotalRounds(Math.max(MIN_ROUNDS, Math.min(MAX_ROUNDS, n)))
	}, [])

	const setInfinite = useCallback((value: boolean) => {
		setIsInfinite(value)
	}, [])

	const saveSession = useCallback(async (rounds: number, durationSeconds: number) => {
		const uid = auth.currentUser?.uid
		if (!uid) return
		try {
			await addDoc(
				collection(db, 'users', uid, 'breathing_sessions'),
				{
					rounds,
					duration: durationSeconds,
					completedAt: new Date(),
					userId: uid,
				},
			)
			toast.success(`Session complete! ${rounds} rounds, ${durationSeconds}s`)
			queryClient.invalidateQueries({ queryKey: ['breathing-week'] })
			queryClient.invalidateQueries({ queryKey: ['breathing-sessions-today'] })
			queryClient.invalidateQueries({ queryKey: ['breathing-sessions-week'] })
		} catch {
			toast.error('Could not save session')
		}
	}, [queryClient])

	const stateRef = useRef({ roundNumber, phaseIndex, countdown, totalRounds, isInfinite })
	stateRef.current = { roundNumber, phaseIndex, countdown, totalRounds, isInfinite }

	const TICK_MS = 1000 // 1 second per countdown step — each phase is 4 seconds

	useEffect(() => {
		if (!isRunning) return

		const interval = setInterval(() => {
			const { roundNumber: r, phaseIndex: p, countdown: c, totalRounds: tr } = stateRef.current

			if (c > 1) {
				setCountdown(c - 1)
				return
			}

			if (p < PHASE_ORDER.length - 1) {
				setPhaseIndex(p + 1)
				setCountdown(PHASE_DURATIONS[p + 1])
				return
			}

			if (!stateRef.current.isInfinite && r >= tr) {
				setIsRunning(false)
				setRoundNumber(1)
				setPhaseIndex(0)
				setCountdown(PHASE_DURATIONS[0])
				saveSession(tr, tr * TOTAL_CYCLE_SECONDS)
				onComplete?.()
				return
			}

			setRoundNumber(r + 1)
			setPhaseIndex(0)
			setCountdown(PHASE_DURATIONS[0])
		}, TICK_MS)

		return () => clearInterval(interval)
	}, [isRunning, saveSession, onComplete])

	return {
		isRunning,
		currentPhase,
		phaseLabel,
		countdown,
		roundNumber,
		totalRounds,
		progress,
		cycleProgress,
		isInfinite,
		start,
		pause,
		reset,
		setRounds,
		setInfinite,
	}
}
