import React, { useEffect, useState, useContext } from 'react'
import Title from './Title'
import { AppContext } from "../context/AppContext";
import EventCard from './EventCard'
import { toast } from 'react-toastify'
import axios from 'axios'

const PremiereSection = () => {

    const { backendUrl } = useContext(AppContext);

    const [premieres, setPremieres] = useState([]);

    const fetchPremieres = async () => {
        try {
            const res = await axios.get(
                backendUrl + '/api/film/available'
            );

            if (res.data.success) {
                const filtered = res.data.films.filter(
                    (film) => film.isPremiere
                );

                setPremieres(filtered);
            } else {
                toast.error(res.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    useEffect(() => {
        fetchPremieres();
    }, []);

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
                premieres.map((film) =>(
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
