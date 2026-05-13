import React, { useContext, useEffect, useState } from 'react'
import axios from "axios";
import { toast } from "react-toastify";
import Title from './Title'
import { assets } from '../assets/assets'
import EventCard from './EventCard'
import { AppContext } from '../context/AppContext'

const RecommendationSection = () => {

    const { backendUrl, navigate, token } = useContext(AppContext);
    
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRecommendations = async () => {
            try {
                const res = await axios.get(
                    backendUrl + '/api/recommendation/personal', { headers: { token } }
                );
    
                if (res.data.success) {
                    setRecommendations(res.data.recommendations);
                } else {
                    toast.error(res.data.message);
                }
    
            } catch (error) {
                console.log(error);
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        if (token) {
            fetchRecommendations();
        } else {
            setLoading(false);
        }
    }, [token]);

  return (
    <div id="recommendations" className='flex flex-col items-center my-10 px-6 md:px-16 lg:px-24 xl:px-32'>

        <div>
            <Title title='Ваші Рекомендації' subTitle='Ми проаналізували ваші вподобання, 
            жанри та переглянуті сеанси, щоб підібрати фільми, які вам точно сподобаються. 
            Тут ви знайдете новинки кіноіндустрії, рейтингові хіти та прем’єри, що відповідають 
            вашому смаку. Дивіться лише те, що дійсно цікаво, та відкривайте нові улюблені фільми. 
            Забронюйте квиток у кілька кліків і насолоджуйтесь найкращими кіносеансами у вашому місті!'/>
        </div>

        {!token ? (

            <div className="mt-10 text-gray-500 text-center">
                Увійдіть в акаунт,
                щоб отримати персональні
                рекомендації
            </div>

        ) : loading ? (

            <div className="mt-10 text-gray-500">
                Завантаження рекомендацій...
            </div>

        ) : (

            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mt-18 items-stretch'>
                { recommendations.map((item) => (
                    <div key={item.film._id}>
                        <EventCard event={item.film}/>
                    </div>
                ))}
            </div>

        )}

        <button onClick={() => {
            navigate('/posters'); scrollTo(0,0)
        }}
        className='flex items-center justify-center gap-2 px-6 py-2 border bg-primary 
        text-light border-borderColor hover:bg-primary-dull rounded-md mt-12 cursor-pointer'>
            Переглянути всі афіші <img className='w-7 invert' src={assets.arrow} alt="" />
        </button>
      
    </div>
  )
}

export default RecommendationSection
