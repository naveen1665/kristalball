import React from 'react'
import Login from './Pages/Pages.Login'
import { AuthProvider } from './Context/AuthContext'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AdminHome from './Pages/Admin/FAdmin.Home'
import CommanderHome from './Pages/Commander/CommanderHome'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element={<CommanderHome/>}/>
      </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App