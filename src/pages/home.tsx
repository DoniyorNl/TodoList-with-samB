import { Button } from '@/components/ui/button'
import { iconS } from '@/constants'
import { Link } from 'react-router-dom'

export default function Home() {
	return (
		<>
			<div className='w-full min-h-screen flex items-center justify-center px-4 pt-[10vh]'>
				<div className='text-center max-w-xl'>
					<h1 className='text-5xl font-bold uppercase tracking-tight text-foreground sm:text-7xl'>
						Plan with me
					</h1>
					<p className='mt-5 text-lg text-muted-foreground'>
						I'm here to help you plan your next big idea, from brainstorming to execution. Let's get
						started.
					</p>
					<Link to='/dashboard'>
						<Button size='lg' className='mt-6 font-semibold tracking-wide'>
							Start planning
						</Button>
					</Link>
					<div className='mt-10'>
						<p className='mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground'>
							As featured in
						</p>
						<div className='flex items-center justify-center gap-6 text-muted-foreground'>
							{iconS.map((Icon, index) => (
								<Icon key={index} className='h-10 w-10 opacity-70' />
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
