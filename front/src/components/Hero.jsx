import React from 'react';
import { assets } from "../assets/assets.js";
import { useNavigate } from 'react-router-dom';

const Hero = () => {

  const navigate = useNavigate()

  return (
    <div className="w-full flex justify-center py-5 sm:px-6 md:px-16 lg:px-24">
      <div className="flex flex-col sm:flex-row border border-borderColor rounded-2xl">
        
        <div className="w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-0 px-6">
          <div className="text-text">
            <div className="flex items-center gap-2 mb-3">
              <p className="w-8 md:w-24 h-[2px] bg-primary-dull"></p>
              <p className="font-medium text-sm md:text-base text-primary-dull">
                Бронюйте легко
              </p>
            </div>
            <h1 className="text-2xl sm:py-3 lg:text-5xl leading-relaxed font-bold">
              Забронюйте квитки у <span className="text-cta">кіно</span>
            </h1>
            <p className="mt-4 text-sm md:text-base text-gray-600">
              Відкрийте для себе найкращі сеанси поруч з вами та отримуйте персональні рекомендації.
            </p>
            <div className="flex items-center gap-2 mt-6 justify-center sm:justify-start">
              <button className="px-6 py-3 bg-primary text-light rounded-xl hover:bg-primary-dull transition"
              onClick={() => {document.getElementById('recommendations').scrollIntoView({ behavior: 'smooth' })}}>
                Перейти до рекомендацій
              </button>
              <button className="px-6 py-3 border border-primary-dull text-primary-dull rounded-xl 
              hover:bg-primary-dull hover:text-light transition" onClick={()=> navigate('/posters')}>
                Переглянути афіші
              </button>
            </div>
          </div>
        </div>

        <img className="w-full sm:w-1/2 object-cover sm:rounded-r-2xl" src={assets.hero} alt="Hero banner"/>
      </div>
    </div>
  );
};

export default Hero;
