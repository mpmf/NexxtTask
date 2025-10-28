import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Root from './pages/Root.tsx'
import SignIn from './pages/SignIn.tsx'
import SignUp from './pages/SignUp.tsx'
import Dashboard from './pages/Dashboard.tsx'
import CreateTask from './pages/CreateTask.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Root />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-task" element={<CreateTask />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
