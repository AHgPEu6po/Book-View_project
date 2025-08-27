import React from 'react';
import { assets } from "../assets/assets.js";
import NewsletterBox from "../components/NewsletterBox.jsx";

const About = () => {
    return (
        <div className='sm:px-6 md:px-16 lg:px-24 text-gray-600'>

            <h1 className='font-semibold text-4xl md:text-[40px] text-center my-8 text-text'>Про Book&View</h1>

            <div className='my-10 flex flex-col gap-10'>
                <img className='w-full object-cover rounded-2xl shadow-lg' src={assets.cinema} alt='Book&View' />
                <div className='flex flex-col justify-center gap-6 text-lg leading-relaxed'>
                    <p>
                        Ласкаво просимо до <span className='font-semibold text-primary-dull'>Book&View</span> — зручного 
                        онлайн-сервісу для бронювання квитків у кінотеатри по всій Україні. 
                        Ми об'єднали найкращі кінотеатри в одному додатку, щоб ви могли легко 
                        обрати фільм, знайти зручний сеанс і забронювати квитки за кілька кліків.
                    </p>
                    <b className='text-xl text-text'>Наша мета</b>
                    <p>
                        Ми прагнемо зробити процес вибору фільмів і бронювання квитків максимально комфортним. 
                        Відтепер більше ніяких черг і довгого пошуку — усе, що потрібно, знаходиться у вашому смартфоні.
                    </p>
                </div>
            </div>

            <div className='pt-6'>
                <h2 className="font-semibold text-4xl md:text-[40px] text-center text-text">Чому обирають нас?</h2>
                <div className='my-10 flex flex-col md:flex-row gap-12 items-center'>
                    <img className='w-full md:max-w-[450px] rounded-2xl shadow-lg' src={assets.cinema_man} alt='Book&View Experience' />
                    <div className='flex flex-col justify-center gap-6 text-lg leading-relaxed md:w-2/4'>
                        <p>
                            Book&View — це не просто сервіс, а ваш персональний помічник у світі кіно. 
                            Ми поєднуємо сучасні технології, щоб надати вам швидкий і приємний досвід бронювання квитків.
                        </p>
                        <p>
                            Завдяки інтеграції з найбільшими кінотеатрами країни, ви завжди бачите актуальні сеанси, 
                            а наші персоналізовані рекомендації допоможуть обрати фільм, що вам сподобається.
                        </p>
                    </div>
                </div>
            </div>

            <div className='flex flex-col md:flex-row text-base mb-20 gap-6'>
                <div className='border border-borderColor rounded-xl px-8 py-8 sm:py-16 flex 
                flex-col gap-5 shadow-md bg-gray-50 hover:shadow-lg transition'>
                    <b className='text-xl text-primary-dull'>Зручність</b>
                    <p>
                        Усе в одному місці: розклад сеансів, вибір місць і бронювання квитків без черг і зайвого клопоту.
                    </p>
                </div>
                <div className='border border-borderColor  rounded-xl px-8 py-8 sm:py-16 flex 
                flex-col gap-5 shadow-md bg-gray-50 hover:shadow-lg transition'>
                    <b className='text-xl text-primary-dull'>Підтримка ЗСУ</b>
                    <p>
                        Частину прибутку ми передаємо на допомогу Збройним Силам України. Разом наближаємо перемогу!
                    </p>
                </div>
                <div className='border border-borderColor  rounded-xl px-8 py-8 sm:py-16 flex 
                flex-col gap-5 shadow-md bg-gray-50 hover:shadow-lg transition'>
                    <b className='text-xl text-primary-dull'>Рекомендації</b>
                    <p>
                        Система персоналізованих порад допоможе вам обрати найкращий фільм для перегляду.
                    </p>
                </div>
            </div>

            <NewsletterBox />
        </div>
    );
};

export default About;
