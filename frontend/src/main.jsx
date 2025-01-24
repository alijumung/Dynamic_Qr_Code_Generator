import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import bg from './assets/bg.png'

createRoot(document.getElementById('root')).render(
    <div
        className="min-h-screen w-full"
        style={{
            backgroundImage: `url(${bg})`, // Use backticks for template literals
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        }}
    >
        <StrictMode>
            <App/>
        </StrictMode>
    </div>
)
