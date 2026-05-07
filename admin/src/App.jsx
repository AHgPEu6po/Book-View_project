import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import AddFilm from './pages/AddFilm.jsx'
import AddCinema from './pages/AddCinema.jsx'
import AddRoom from './pages/AddRoom.jsx'
import AddSessionList from './pages/AddSessionList.jsx'
import ListFilms from './pages/ListFilms.jsx'
import ListCinemas from './pages/ListCinemas.jsx'
import ListSessionLists from './pages/ListSessionLists.jsx'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '₴'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : '');

  useEffect(() => {
    localStorage.setItem('token', token)
  }, [token])

  return (
      <div className='bg-gray-50 min-h-screen'>
        <ToastContainer />
        {token === "" ? <Login setToken={setToken} />
            : <>
              <Navbar setToken={setToken} />
              <hr />
              <div className='flex w-full'>
                <Sidebar />
                <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
                  <Routes>
                    <Route path='/addfilm' element={<AddFilm token={token} />} />
                    <Route path='/listfilms' element={<ListFilms token={token} />} />
                    <Route path='/addcinema' element={<AddCinema token={token} />} />
                    <Route path='/listcinemas' element={<ListCinemas token={token} />} />
                    <Route path='/addroom' element={<AddRoom token={token} />} />
                    <Route path='/addsessionlist' element={<AddSessionList token={token} />} />
                    <Route path='/listsessionlists' element={<ListSessionLists token={token} />} />
                  </Routes>
                </div>
              </div>
            </>
        }
      </div>
  )
}

export default App