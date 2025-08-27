import React from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

const Footer = () => {

    const navigate = useNavigate()

  return (
        <div className="px-6 md:px-16 lg:px-24 xl:px-32">
            <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-borderColor text-text">
                <div>
                    <img className="w-34 md:w-32" src={assets.logo} alt="Logo" />
                    <p className="max-w-[410px] mt-6">Book & View — ваш ідеальний сервіс для бронювання квитків та перегляду новинок кіно. 
                    Отримуйте найактуальнішу інформацію про кінотеатри, постери та акції.</p>
                </div>
                <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
                    <div>
                        <h3 className='font-semibold text-base text-gray-900 md:mb-5 mb-2'>Посилання</h3>
                        <ul className='text-sm space-y-1'>
                            <li><a onClick={()=> {navigate('/'); scrollTo(0,0)}} 
                            className="hover:underline transition cursor-pointer">На головну</a></li>
                            <li><a onClick={()=> {navigate('/cinemas'); scrollTo(0,0)}} 
                            className="hover:underline transition cursor-pointer">Кінотеатри</a></li>
                            <li><a onClick={()=> {navigate('/posters'); scrollTo(0,0)}} 
                            className="hover:underline transition cursor-pointer">Афіші</a></li>
                            <li><a onClick={()=> {navigate('/about'); scrollTo(0,0)}} 
                            className="hover:underline transition cursor-pointer">Про нас</a></li>
                            <li><a onClick={()=> {navigate('/contact'); scrollTo(0,0)}} 
                            className="hover:underline transition cursor-pointer">Контакти</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='font-semibold text-base text-gray-900 md:mb-5 mb-2'>Ресурси</h3>
                        <ul className='text-sm space-y-1'>
                            <li><a href="#" className="hover:underline transition">Технічна підтримка</a></li>
                            <li><a href="#" className="hover:underline transition">Умови користування</a></li>
                            <li><a href="#" className="hover:underline transition">Методи оплати</a></li>
                            <li><a href="#" className="hover:underline transition">Політика конфіденційності</a></li>
                            <li><a href="#" className="hover:underline transition">Файли Cookie</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className='font-semibold text-base text-gray-900 md:mb-5 mb-2'>Соцмережі</h3>
                        <ul className='text-sm space-y-2'>
                            <li><a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer"
                                aria-label="Instagram" className="hover:underline transition flex gap-2">
                                <img src={assets.instagram}  alt="Instagram" className="w-4 h-4"/>
                                Instagram
                            </a></li>
                            <li><a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer"
                                aria-label="Facebook" className="hover:underline transition flex gap-2">
                                <img src={assets.facebook} alt="Facebook" className="w-4 h-4"/>
                                Facebook
                                </a></li>
                            <li><a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer"
                                aria-label="X (Twitter)" className="hover:underline transition flex gap-2">
                                <img src={assets.twitter} alt="X (Twitter)" className="w-4 h-4"/>
                                Twitter
                            </a></li>
                            <li><a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer"
                                aria-label="YouTube"className="hover:underline transition flex gap-2">
                                <img src={assets.youtube}  alt="YouTube" className="w-4 h-4"/>
                                YouTube
                            </a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <p className="py-4 text-center text-sm text-text">
                2025 © Book & View. Всі права захищені.
            </p>
        </div>
    );
}

export default Footer
