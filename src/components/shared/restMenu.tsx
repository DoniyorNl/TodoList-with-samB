import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Link } from 'react-router-dom'
import { Coffee, Wind, Timer } from 'lucide-react'

export default function RestMenu() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				className='flex items-center justify-center rounded-md p-2 hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring'
				aria-label='Rest & focus methods'
			>
				<Coffee className='h-5 w-5' />
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end' className='w-52'>
				<DropdownMenuItem asChild>
					<Link to='/breathing' className='flex cursor-pointer items-center gap-2'>
						<Wind className='h-4 w-4' />
						Box Breathing
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link to='/pomodoro' className='flex cursor-pointer items-center gap-2'>
						<Timer className='h-4 w-4' />
						Pomodoro
					</Link>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
