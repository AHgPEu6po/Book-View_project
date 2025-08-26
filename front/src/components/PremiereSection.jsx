import React, { useEffect, useState } from 'react'
import Title from './Title'
import { films } from '../assets/assets'
import EventCard from './EventCard'

const PremiereSection = () => {

    const [Premieres, setPremieres] = useState([]);

    useEffect(() => {
        const premieres = films.filter((film) => (film.isPremiere))
        setPremieres(premieres.slice(0, 10))
    }, [films])

  return (
    <div className='flex flex-col items-center my-10 px-6 md:px-16 lg:px-24 xl:px-32'>

        <div>
            <Title title="Довгоочікувані Прем'єри" subTitle="Відкрийте найочікуваніші кінопрем'єри! 
            У цій секції зібрані найсвіжіші фільми, які тільки з'явилися на великих екранах. 
            Переглядайте трейлери, дізнавайтеся деталі про сюжет і акторів та бронюйте квитки 
            онлайн у кілька кліків. Будьте першими, хто оцінить новинки кіно!"/>
        </div>
        
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mt-18 items-stretch'>
            {
                Premieres.map((film) =>(
                    <div key={film._id}>
                        <EventCard event={film}/>
                    </div>
                ))
            }
        </div>
      
    </div>
  )
}

export default PremiereSection
