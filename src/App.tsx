import { Route, Routes } from 'react-router-dom'
import Navbar from './components/shared/navbar'
import { Toaster } from './components/ui/sonner'
import Auth from './pages/auth'
import Breathing from './pages/breathing'
import Dashboard from './pages/dashboard'
import Home from './pages/home'
import Pomodoro from './pages/pomodoro'

function App() {
	return (
		<>
			<Navbar />
			<Routes>
				<Route path='/' element={<Auth />} />
				<Route path='/home' element={<Home />} />
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/breathing' element={<Breathing />} />
				<Route path='/pomodoro' element={<Pomodoro />} />
			</Routes>
			<Toaster />
		</>
	)
}

export default App
