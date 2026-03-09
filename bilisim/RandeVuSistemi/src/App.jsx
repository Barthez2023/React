import { useState } from 'react'
import './App.css'
import AuthHome from './pages/Auth/AuthHome'
import React from 'react'
import { BrowserRouter, Routes, Route,useNavigate } from "react-router-dom";
import SignInPatient from './pages/signin/signinhasta';

function App() {
  const [count, setCount] = useState(0)
  return (
    <>
    <Routes>
      <Route path="/" element={<AuthHome/>} />
      <Route path="/signinhasta" element={<SignInPatient/>} />
    </Routes>
    </>
  )
}

export default App
