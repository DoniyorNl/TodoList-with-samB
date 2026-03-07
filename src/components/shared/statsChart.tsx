import { IPlanData } from '@/types/types'
import { format, startOfDay, subDays } from 'date-fns'
import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from 'recharts'

interface Props {
	data: IPlanData
}

export default function StatsChart({ data }: Props) {
	// Generate last 7 days data
	const last7Days = Array.from({ length: 7 }, (_, i) => {
		const date = subDays(new Date(), 6 - i)
		const dayStart = startOfDay(date)
		const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000)

		// Calculate total minutes for this day
		let dayMinutes = 0
		data.plans.forEach(plan => {
			if (plan.startTime) {
				const planDate = new Date(plan.startTime)
				if (planDate >= dayStart && planDate < dayEnd) {
					dayMinutes += Math.floor((plan.totalTime || 0) / (1000 * 60))
				}
			}
		})

		return {
			name: format(date, 'EEE'),
			minutes: dayMinutes,
			color: dayMinutes > 60 ? 'hsl(217 91% 45%)' : dayMinutes > 30 ? 'hsl(217 91% 58%)' : 'hsl(var(--muted-foreground))',
		}
	})

	return (
		<div className='w-full rounded-xl border border-border bg-card p-4 shadow-sm'>
			<h3 className='mb-3 text-base font-semibold text-foreground'>
				Last 7 days
			</h3>
			<ResponsiveContainer width='100%' height={220}>
				<BarChart data={last7Days}>
					<CartesianGrid strokeDasharray='3 3' stroke='currentColor' opacity={0.1} />
					<XAxis dataKey='name' stroke='currentColor' fontSize={12} />
					<YAxis stroke='currentColor' fontSize={12} />
					<Tooltip
						contentStyle={{
							backgroundColor: 'hsl(var(--card))',
							border: '1px solid hsl(var(--border))',
							borderRadius: '8px',
						}}
						formatter={value => [`${value} min`, 'Time']}
					/>
					<Bar dataKey='minutes' radius={[8, 8, 0, 0]}>
						{last7Days.map((entry, index) => (
							<Cell key={`cell-${index}`} fill={entry.color} />
						))}
					</Bar>
				</BarChart>
			</ResponsiveContainer>
		</div>
	)
}
