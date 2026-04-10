import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
//vérifie bien le chemin vers le fichier contetxAPI
import { UserProvider } from './pages/contextAPI/randevuSayiContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <UserProvider>
          <App />
      </UserProvider>
    </BrowserRouter>
  </StrictMode>
)
