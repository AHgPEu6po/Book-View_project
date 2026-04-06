import React, { useState } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import FilmDetails from './pages/FilmDetails'
import Films from './pages/Films'
import MyBookings from './pages/MyBookings'
import About from './pages/About'
import Footer from './components/Footer'
import Contact from './pages/Contact'
import CinemaDetails from './pages/CinemaDetails'
import Cinemas from './pages/Cinemas'

const App = () => {

  const [showLogin, setShowLogin] = useState(false)
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return (
    <>
      {!isOwnerPath && <Navbar setShowLogin={setShowLogin}/>}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cinemas/:id' element={<CinemaDetails/>}/>
        <Route path='/cinemas' element={<Cinemas/>}/>
        <Route path='/posters/:id' element={<FilmDetails/>}/>
        <Route path='/posters' element={<Films/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/my-bookings' element={<MyBookings/>}/>
      </Routes>

      <Footer/>
    </>
  )
}

export default App
