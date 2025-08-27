import React from 'react';
import { assets } from "../assets/assets.js";
import NewsletterBox from "../components/NewsletterBox.jsx";

const Contact = () => {
    return (
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-gray-600">
    
            <h1 className="font-semibold text-4xl md:text-[40px] text-center my-8 text-text">
                Зв'яжіться з нами
            </h1>

            <div className="flex flex-col md:flex-row gap-12 mb-28 items-center">
            
                <img
                    className="w-full md:max-w-[550px] rounded-2xl shadow-lg"
                    src={assets.cinema_inside}
                    alt="Кінотеатр"
                />

                <div className="w-full md:w-[500px]">
                    <h2 className="font-semibold text-2xl mb-6 text-text">Наші офіси</h2>

                    <ul className="space-y-3">
                        <li>
                            <a href="https://maps.app.goo.gl/7ZSHg4tzQWAuRKSq9" target="_blank"
                               className="hover:underline transition">
                                Київ: вул. Оноре де Бальзака, 100
                            </a>
                        </li>
                        <li>
                            <a href="https://www.google.com/maps/place/Шевченка,+10,+Львів" target="_blank"
                               className="hover:underline transition">
                                Львів: вул. Шевченка, 10
                            </a>
                        </li>
                        <li>
                            <a href="https://www.google.com/maps/place/Дерибасівська,+15,+Одеса" target="_blank"
                               className="hover:underline transition">
                                Одеса: вул. Дерибасівська, 15
                            </a>
                        </li>
                    </ul>

                    <div className="mt-6 space-y-2">
                        <p>
                            Телефон підтримки:&nbsp;
                            <a href="tel:+380507777777" className="hover:underline transition">
                                050 777 77 77
                            </a>
                        </p>
                        <p>
                            Пошта:&nbsp;
                            <a href="mailto:book&view.support@gmail.com" className="hover:underline transition">
                                book&view.support@gmail.com
                            </a>
                        </p>
                    </div>

                    <h3 className="font-semibold text-xl mt-8 text-text">Соціальні мережі</h3>
                    <div className="flex space-x-4 mt-4">
                        {['instagram', 'facebook', 'twitter', 'youtube'].map((network) => (
                            <a key={network} href={`https://www.${network}.com`} target="_blank" rel="noopener noreferrer"
                               aria-label={network}>
                                <img
                                    src={assets[network]}
                                    alt={network}
                                    className="w-8 h-8 hover:scale-110 transition-transform"
                                />
                            </a>
                        ))}
                    </div>

                    <button
                        className="mt-8 w-full text-lg px-6 py-3 bg-primary text-light rounded-xl hover:bg-primary-dull transition shadow-md">
                        Технічна Підтримка
                    </button>
                </div>
            </div>

            <NewsletterBox />
        </div>
    );
};

export default Contact;
