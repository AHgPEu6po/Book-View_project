import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import EventDetails from './pages/EventDetails'
import Events from './pages/Events'
import MyBookings from './pages/MyBookings'
import About from './pages/About'
import Footer from './components/Footer'
import Contact from './pages/Contact'

const App = () => {

  const [showLogin, setShowLogin] = useState(false)
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin}/>}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/event-details/:id' element={<EventDetails/>}/>
        <Route path='/events' element={<Events/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
      </Routes>

      <Footer/>
    </>
  )
}

export default App
