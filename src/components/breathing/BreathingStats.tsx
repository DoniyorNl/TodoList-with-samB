import { useQuery } from '@tanstack/react-query'
import { startOfDay } from 'date-fns'
import { db } from '@/firebase/fb_init'
import { collection, getDocs, query, where } from 'firebase/firestore/lite'
import { useUserState } from '@/stores/user.store'

export function BreathingStats() {
	const { user } = useUserState()

	const { data: todayCount = 0 } = useQuery({
		queryKey: ['breathing-sessions-today', user?.uid],
		queryFn: async () => {
			if (!user?.uid) return 0
			const todayStart = startOfDay(new Date())
			const q = query(
				collection(db, 'users', user.uid, 'breathing_sessions'),
				where('completedAt', '>=', todayStart),
			)
			const snap = await getDocs(q)
			return snap.size
		},
		enabled: !!user?.uid,
	})

	const { data: weekCount = 0 } = useQuery({
		queryKey: ['breathing-sessions-week', user?.uid],
		queryFn: async () => {
			if (!user?.uid) return 0
			const now = new Date()
			const weekStart = new Date(now)
			weekStart.setDate(weekStart.getDate() - 7)
			const q = query(
				collection(db, 'users', user.uid, 'breathing_sessions'),
				where('completedAt', '>=', weekStart),
			)
			const snap = await getDocs(q)
			return snap.size
		},
		enabled: !!user?.uid,
	})

	if (!user) return null

	return (
		<div className="flex items-center gap-4 text-sm text-muted-foreground">
			<span>{todayCount} session{todayCount !== 1 ? 's' : ''} today</span>
			<span>·</span>
			<span>{weekCount} this week</span>
		</div>
	)
}
