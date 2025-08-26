import React, { useState } from 'react';
import { Play, X } from 'lucide-react';
import { useNavigate } from "react-router-dom";

const EventCard = ({ event }) => {

  const navigate = useNavigate()
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const getEmbedURL = (url) => {
    return url.replace("watch?v=", "embed/") + "?autoplay=1";
  };

  const openTrailer = () => {
    if (event.trailerURL) {
      setIsTrailerOpen(true);
    } else {
      alert('Трейлер недоступний');
    }
  };

  const closeTrailer = () => setIsTrailerOpen(false);

  return (
    <div onClick = {() => {navigate(`/event-details/${event._id}`); scrollTo(0,0)}} 
    className={`relative flex flex-col h-full rounded-xl overflow-hidden shadow-lg 
    transition-all duration-500 cursor-pointer bg-white group ${event.isPremiere ? 
      'border-gradient-premiere animate-premiere-glow' : ''}`}>
        <div className="relative overflow-hidden">
          <img src={event.image} alt={event.name} className="w-full h-full 
          object-cover transition-transform duration-500 group-hover:scale-105"/>

          {event.isPremiere && (
            <p className="absolute top-4 left-4 bg-gradient-to-r from-rose-500 to-yellow-400 
            text-white text-xs px-3 py-1 rounded-full font-bold">
              🎬 Premiere
            </p>
          )}

          <div className="absolute bottom-4 right-4 w-10 h-10 rounded-full border-2 border-white 
          bg-black/80 flex backdrop-blur-sm items-center justify-center text-white font-bold text-sm">
            {event.ageRating}
          </div>

          <button
            onClick={(e) => { 
              e.stopPropagation(); 
              openTrailer();
            }}
            className="absolute bottom-4 left-4 bg-cta text-white rounded-full p-3 shadow-md 
            hover:bg-cta-hover transition-all duration-300 flex items-center justify-center"
            title="Дивитись трейлер"
          >
            <Play className="w-5 h-5" />
          </button>
        </div>

      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-medium mb-2">{event.name}</h3>

        <div className="flex flex-wrap gap-1 mb-3">
          {event.category &&
            event.category.map((cat, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full hover:bg-gray-200 transition"
              >
                {cat}
              </span>
            ))}
        </div>

      </div>

      {isTrailerOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" 
        onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-xl overflow-hidden shadow-lg max-w-3xl w-full relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                closeTrailer();
              }}
              className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe
              src={getEmbedURL(event.trailerURL)}
              title="Trailer"
              className="w-full aspect-video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCard;
