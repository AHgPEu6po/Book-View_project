import React from 'react'
import Title from './Title'
import { assets, films } from '../assets/assets'
import EventCard from './EventCard'
import { useNavigate } from "react-router-dom";

const RecommendationSection = () => {

    const navigate = useNavigate()

  return (
    <div id="recommendations" className='flex flex-col items-center my-10 px-6 md:px-16 lg:px-24 xl:px-32'>

        <div>
            <Title title='Ваші Рекомендації' subTitle='Ми проаналізували ваші вподобання, 
            жанри та переглянуті сеанси, щоб підібрати фільми, які вам точно сподобаються. 
            Тут ви знайдете новинки кіноіндустрії, рейтингові хіти та прем’єри, що відповідають 
            вашому смаку. Дивіться лише те, що дійсно цікаво, та відкривайте нові улюблені фільми. 
            Забронюйте квиток у кілька кліків і насолоджуйтесь найкращими кіносеансами у вашому місті!'/>
        </div>
        
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 mt-18 items-stretch'>
            {
                films.slice(0, 7).map((film) =>(
                    <div key={film._id}>
                        <EventCard event={film}/>
                    </div>
                ))
            }
        </div>

        <button onClick={() => {
            navigate('/posters'); scrollTo(0,0)
        }}
        className='flex items-center justify-center gap-2 px-6 py-2 border bg-primary 
        text-light border-borderColor hover:bg-primary-dull rounded-md mt-12 cursor-pointer'>
            Переглянути усі афіші <img className='w-7 invert' src={assets.arrow} alt="" />
        </button>
      
    </div>
  )
}

export default RecommendationSection
