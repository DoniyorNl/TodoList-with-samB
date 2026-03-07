import { auth, db } from '@/firebase/fb_init'
import { endOfWeek, startOfWeek } from 'date-fns'
import { collection, getDocs, query, where } from 'firebase/firestore/lite'

export const BreathingService = {
	getSessionsThisWeek: async (): Promise<number> => {
		const uid = auth.currentUser?.uid
		if (!uid) return 0

		const now = new Date()
		const weekStart = startOfWeek(now)
		const weekEnd = endOfWeek(now)

		const q = query(
			collection(db, 'users', uid, 'breathing_sessions'),
			where('completedAt', '>=', weekStart),
			where('completedAt', '<=', weekEnd),
		)
		const snap = await getDocs(q)
		return snap.size
	},
}
