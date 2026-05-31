import React from 'react'
import {BrowserRouter as Router , Routes , Route} from "react-router-dom"
import Auth from './Features/Auth/pages/Auth'
import { AuthProvider } from './Features/Auth/AuthContext'
import Landing from './Features/Freelance/Pages/Landing'
import Dashboard from './Features/Freelance/Pages/Dashboard'
import Client from './Features/Freelance/Pages/Client'
import Project from './Features/Freelance/Pages/Project'
import Subscription from './Features/Freelance/Pages/Subscription'
import Notification from './Features/Freelance/Pages/Notification'
import AI from './Features/Freelance/Pages/AI'
import Profile from './Features/Freelance/Pages/Profile'
import Protected from './Features/Auth/Protected'
import Public from './Features/Auth/Public'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#16263e',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.12)'
            }
          }}
        />
        <Routes>
          <Route path='/' element={<Landing/>}/>
          <Route path='/auth' element={<Public><Auth/></Public>}/>
          <Route path='/dashboard' element={<Protected><Dashboard/></Protected>}/>
          <Route path='/client' element={<Protected><Client/></Protected>}/>
          <Route path='/project' element={<Protected><Project/></Protected>}/>
          <Route path='/notification' element={<Protected><Notification/></Protected>}/>
          <Route path='/billing' element={<Protected><Subscription/></Protected>}/>
          <Route path='/ai/email' element={<Protected><AI page={"email"}/></Protected>}/>
          <Route path='/ai/proposal' element={<Protected><AI page={"proposal"}/></Protected>}/>
          <Route path='/ai/contract' element={<Protected><AI page={"contract"}/></Protected>}/>
          <Route path='/ai/invoice' element={<Protected><AI page={"invoice"}/></Protected>}/>
          <Route path='/profile' element={<Protected><Profile/></Protected>}/>
        </Routes>
      </AuthProvider>
    </Router>
  )
}
