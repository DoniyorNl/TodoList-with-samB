import {
	LONG_BREAK_SECONDS,
	POMODOROS_BEFORE_LONG_BREAK,
	SHORT_BREAK_SECONDS,
	WORK_SECONDS,
} from '@/constants/pomodoro.constants'
import { useCallback, useEffect, useRef, useState } from 'react'

export type PomodoroPhase = 'work' | 'short-break' | 'long-break'

const TICK_MS = 1000

export function usePomodoro() {
	const [phase, setPhase] = useState<PomodoroPhase>('work')
	const [timeLeft, setTimeLeft] = useState(WORK_SECONDS)
	const [isRunning, setIsRunning] = useState(false)
	const [pomodoroCount, setPomodoroCount] = useState(0)

	const phaseRef = useRef(phase)
	const timeLeftRef = useRef(timeLeft)
	const pomodoroCountRef = useRef(pomodoroCount)
	phaseRef.current = phase
	timeLeftRef.current = timeLeft
	pomodoroCountRef.current = pomodoroCount

	const getPhaseDuration = useCallback((p: PomodoroPhase) => {
		switch (p) {
			case 'work':
				return WORK_SECONDS
			case 'short-break':
				return SHORT_BREAK_SECONDS
			case 'long-break':
				return LONG_BREAK_SECONDS
		}
	}, [])

	const advancePhase = useCallback(() => {
		const count = pomodoroCountRef.current
		const current = phaseRef.current

		if (current === 'work') {
			setPomodoroCount(c => c + 1)
			const nextCount = count + 1
			if (nextCount >= POMODOROS_BEFORE_LONG_BREAK) {
				setPhase('long-break')
				setTimeLeft(LONG_BREAK_SECONDS)
			} else {
				setPhase('short-break')
				setTimeLeft(SHORT_BREAK_SECONDS)
			}
		} else {
			setPhase('work')
			setTimeLeft(WORK_SECONDS)
			if (current === 'long-break') {
				setPomodoroCount(0)
			}
		}
	}, [])

	useEffect(() => {
		if (!isRunning) return

		const interval = setInterval(() => {
			const t = timeLeftRef.current
			if (t > 1) {
				setTimeLeft(t - 1)
				return
			}
			advancePhase()
		}, TICK_MS)

		return () => clearInterval(interval)
	}, [isRunning, advancePhase])

	const start = useCallback(() => setIsRunning(true), [])
	const pause = useCallback(() => setIsRunning(false), [])
	const reset = useCallback(() => {
		setIsRunning(false)
		const dur = getPhaseDuration(phaseRef.current)
		setTimeLeft(dur)
	}, [getPhaseDuration])

	const resetToWork = useCallback(() => {
		setIsRunning(false)
		setPhase('work')
		setTimeLeft(WORK_SECONDS)
		setPomodoroCount(0)
	}, [])

	return {
		phase,
		timeLeft,
		isRunning,
		pomodoroCount,
		start,
		pause,
		reset,
		resetToWork,
	}
}
