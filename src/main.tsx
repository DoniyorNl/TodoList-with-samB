import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import AuthProvider from './components/providers/auth-provider.tsx'
import { ThemeProvider } from './components/providers/theme-provider.tsx'
import './index.css'

// Create a client
const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider defaultTheme='light' storageKey='plan-with-me-theme'>
			<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
				<QueryClientProvider client={queryClient}>
					<AuthProvider>
						<App />
					</AuthProvider>
				</QueryClientProvider>
			</BrowserRouter>
		</ThemeProvider>
	</StrictMode>,
)
