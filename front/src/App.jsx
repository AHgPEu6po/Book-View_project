import React, { useContext } from 'react'
import Navbar from './components/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import FilmDetails from './pages/FilmDetails'
import Films from './pages/Films'
import About from './pages/About'
import Footer from './components/Footer'
import Contact from './pages/Contact'
import CinemaDetails from './pages/CinemaDetails'
import Cinemas from './pages/Cinemas'
import Session from './pages/Session'
import Login from './components/Login'
import Profile from './pages/Profile'
import MyTickets from './pages/MyTickets'
import History from './pages/History'
import Cart from './pages/Cart'
import Verify from './pages/Verify'
import { AppContext } from "./context/AppContext";

const App = () => {

  const { showLogin } = useContext(AppContext);

  return (
    <>
      {showLogin && <Login/>}
      
      <Navbar/>

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cinemas/:id' element={<CinemaDetails/>}/>
        <Route path='/cinemas' element={<Cinemas/>}/>
        <Route path='/posters/:id' element={<FilmDetails/>}/>
        <Route path='/posters' element={<Films/>}/>
        <Route path='/session/:id' element={<Session/>}/>
        <Route path='/about' element={<About/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/tickets' element={<MyTickets/>}/>
        <Route path='/history' element={<History/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/verify' element={<Verify/>}/>
      </Routes>

      <Footer/>
    </>
  )
}

export default App
