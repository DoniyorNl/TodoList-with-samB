import TaskForm from '@/components/forms/taskForm'
import Loader from '@/components/shared/loader'
import PlansItems from '@/components/shared/plansItems'
import StatsChart from '@/components/shared/statsChart'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { db } from '@/firebase/fb_init'
import { taskSchema } from '@/lib/validation'
import { PlansService } from '@/service/plan.service'
import { useUserState } from '@/stores/user.store'
import { IPlan } from '@/types/types'
import { useQuery } from '@tanstack/react-query'
import { addMilliseconds, addMinutes, format } from 'date-fns'
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore/lite'
import { useEffect, useState } from 'react'
import { RiAlertLine } from 'react-icons/ri'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { z } from 'zod'

/**
 * Dashboard Component
 * Main dashboard for managing tasks and viewing time statistics
 * Features: Create/Edit/Delete tasks, Start/Pause timers, View real-time statistics
 */
export default function Dashboard() {
	// Local state management
	const [deleting, setDeleting] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [current, setCurrent] = useState<IPlan | null>(null)
	const [open, setOpen] = useState(false)
	const [currentTime, setCurrentTime] = useState(Date.now()) // For real-time timer updates
	const { user } = useUserState()
	const navigate = useNavigate()

	useEffect(() => {
		if (!user) {
			// alert('Please login!')
			navigate('/')
		}
	}, [user, navigate])

	const { isPending, data, error, refetch } = useQuery({
		queryKey: ['plans'],
		queryFn: PlansService.getPlans,
	})

	// Real-time update every second
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentTime(Date.now())
		}, 1000)
		return () => clearInterval(interval)
	}, [])

	const onAdd = async ({ title }: z.infer<typeof taskSchema>) => {
		try {
			taskSchema.parse({ title })
			if (!user) return null

			await addDoc(collection(db, 'plans'), {
				title,
				createdAt: new Date(),
				startTime: null,
				endTime: null,
				userId: user.uid,
				status: 'un_started',
			})
			refetch()
			setOpen(false)
		} catch (error) {
			toast.error('Failed to add plan. Please try again.')
		}
	}
	const onUpdate = async ({ title }: z.infer<typeof taskSchema>) => {
		if (!user || !current) return null

		return updateDoc(doc(db, 'plans', current.id), { title })
			.then(() => refetch())
			.then(() => setIsEditing(false))
			.then(() => setCurrent(null))
			.finally(() => setOpen(false))
	}

	const onEdit = (plan: IPlan) => {
		setIsEditing(true)
		setCurrent(plan)
	}

	const onDelete = async (id: string) => {
		setDeleting(true)
		const promise = deleteDoc(doc(db, 'plans', id))
			.then(() => {
				refetch()
			})
			.finally(() => setDeleting(false))

		toast.promise(promise, {
			loading: 'Loading...',
			success: 'Plan deleted successfully!',
			error: 'Failed to delete plan!',
		})
	}
	const formatTime = (time: number) => {
		const data = addMilliseconds(new Date(0), time)
		const formattedData = format(addMinutes(data, data.getTimezoneOffset()), 'HH:mm:ss')
		return formattedData
	}

	const formatWeek = (milliseconds: number) => {
		const totalHours = Math.floor(milliseconds / (1000 * 60 * 60))
		const weeks = Math.floor(totalHours / (24 * 7))
		const days = Math.floor((totalHours % (24 * 7)) / 24)
		const hours = totalHours % 24
		return `${weeks}w ${days}d ${hours}h`
	}

	const formatMonth = (milliseconds: number) => {
		const totalHours = Math.floor(milliseconds / (1000 * 60 * 60))
		const months = Math.floor(totalHours / (24 * 30))
		const days = Math.floor((totalHours % (24 * 30)) / 24)
		const hours = totalHours % 24
		return `${months}m ${days}d ${hours}h`
	}

	// Calculate live totals including running tasks
	const calculateLiveTotals = () => {
		if (!data) return { weekTotal: 0, monthTotal: 0, total: 0 }

		let additionalTime = 0
		data.plans.forEach(plan => {
			if (plan.status === 'in_progress' && plan.startTime) {
				additionalTime += currentTime - plan.startTime
			}
		})

		return {
			weekTotal: data.weekTotal + additionalTime,
			monthTotal: data.monthTotal + additionalTime,
			total: data.total + additionalTime,
		}
	}

	const liveTotals = calculateLiveTotals()

	return (
		<>
			<div className='min-h-screen max-w-7xl mx-auto py-8 px-4 pt-[calc(10vh+2rem)]'>
				<div className='grid grid-cols-1 lg:grid-cols-2 w-full gap-8'>
					{/* Left side - Planning section */}
					<div className='flex flex-col rounded-xl space-y-3 border border-gray-700/30 bg-card/50 backdrop-blur-sm glow-purple'>
						<div className='w-full p-4 flex justify-between'>
							<div className='text-2xl font-bold'>Planning</div>
							<Button size='icon' onClick={() => setOpen(true)}>
								+
							</Button>
						</div>
						<Separator />
						<div className='w-full p-4 rounded-md flex justify-between'>
							{(isPending || deleting) && <Loader />}
							{error && (
								<Alert variant='destructive' className='w-full'>
									<RiAlertLine className='h-4 w-4' />
									<AlertTitle>Error</AlertTitle>
									<AlertDescription>
										{'Something went wrong. Please check your login and try again.'}
									</AlertDescription>
								</Alert>
							)}
							{data && (
								<div className='flex flex-col space-y-3 w-full'>
									{!isEditing &&
										data.plans.map(plan => (
											<PlansItems
												refetch={refetch}
												key={plan.id}
												plan={plan}
												onEdit={() => onEdit(plan)}
												onDelete={() => onDelete(plan.id)}
											/>
										))}
									{isEditing && (
										<TaskForm
											title={current?.title}
											isEdit
											onClose={() => setIsEditing(false)}
											handler={
												onUpdate as (values: z.infer<typeof taskSchema>) => Promise<void | null>
											}
										/>
									)}
								</div>
							)}
						</div>
					</div>

					{/* Right side - Statistics */}
					<div className='flex flex-col space-y-4'>
						{/* Stats Cards - Compact Row */}
						{data && (
							<div className='grid grid-cols-3 gap-3'>
								<div className='p-3 relative rounded-xl border border-slate-800/30 bg-gradient-to-br from-teal-500/10 to-cyan-600/10 backdrop-blur-sm card-hover glow-teal'>
									<div className='text-sm font-semibold '>Total Time</div>
									<div className='text-xl font-bold gradient-text'>
										{formatTime(liveTotals.total)}
									</div>
								</div>
								<div className='p-3 relative rounded-xl border border-slate-800/30 bg-gradient-to-br from-cyan-500/10 to-teal-600/10 backdrop-blur-sm card-hover glow-emerald'>
									<div className='text-sm font-semibold '>Total Week</div>
									<div className='text-xl font-bold gradient-text'>
										{formatWeek(liveTotals.weekTotal)}
									</div>
								</div>
								<div className='p-3 relative rounded-xl border border-slate-800/30 bg-gradient-to-br from-cyan-500/10 to-teal-600/10 backdrop-blur-sm card-hover glow-teal'>
									<div className='text-sm font-semibold '>Total Month</div>
									<div className='text-xl font-bold gradient-text'>
										{formatMonth(liveTotals.monthTotal)}
									</div>
								</div>
							</div>
						)}

						{/* Chart */}
						{data && <StatsChart data={data} />}
					</div>
				</div>
			</div>

			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger />
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Create New Plan</DialogTitle>
					</DialogHeader>
					<Separator />
					<TaskForm handler={onAdd} />
				</DialogContent>
			</Dialog>
		</>
	)
}
