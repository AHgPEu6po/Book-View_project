import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SessionRow from "./SessionRow";
import { Play, X } from "lucide-react";

const SessionCard = ({ film, cinema, isFilmPage, formatDate, formats }) => {
  const navigate = useNavigate();
  const [isTrailerOpen, setIsTrailerOpen] = useState(false);

  const handleClick = () => {
    if (isFilmPage) {
      navigate(`/cinemas/${cinema._id}`);
    } else {
      navigate(`/posters/${film._id}`);
    }
  };

  const openTrailer = (e) => {
    e.stopPropagation();
    if (film?.trailerURL) {
      setIsTrailerOpen(true);
    } else {
      alert("Трейлер недоступний");
    }
  };

  const closeTrailer = () => setIsTrailerOpen(false);

  const groupByDate = (sessions = []) => {
    return sessions.reduce((acc, s) => {
      if (!acc[s.date]) acc[s.date] = [];
      acc[s.date].push(s);
      return acc;
    }, {});
  };

  const sessionsData = isFilmPage ? cinema.sessions : film.sessions;
  const grouped = groupByDate(sessionsData);
  const hasSessions = Object.keys(grouped).length > 0;

  if (!hasSessions) return null;

  const getEmbedURL = (url) =>
    url.replace("watch?v=", "embed/") + "?autoplay=1";

  return (
    <div
      onClick={handleClick}
      className="flex gap-4 p-4 border border-borderColor rounded-xl relative cursor-pointer hover:bg-gray-50 transition"
    >
      {!isFilmPage && (
        <div
          className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center 
          bg-none text-borderColor text-xs rounded-full border-2 border-borderColor"
        >
          {film.ageRating}
        </div>
      )}

      <img
        src={isFilmPage ? cinema.image : film.image}
        alt={isFilmPage ? cinema.name : film.name}
        className={`object-cover rounded-lg ${
          isFilmPage
            ? "w-64 h-32"
            : "w-24 h-32"
        }`}
      />

      <div className="flex flex-col w-full">
        <div className="flex items-center gap-3 text-left">
          <h3 className="font-semibold text-lg">
            {isFilmPage ? cinema.name : film.name}
          </h3>

          {!isFilmPage && film?.trailerURL && (
            <div
              onClick={openTrailer}
              className="flex items-center gap-1 text-sm text-cta font-medium cursor-pointer hover:underline"
            >
              <div
                className="bg-cta text-white rounded-full p-2 shadow-md 
                hover:bg-cta-hover transition-all duration-300 flex items-center justify-center"
              >
                <Play className="w-3 h-3" />
              </div>
              <span>Переглянути трейлер</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {isFilmPage
            ? cinema.address
            : film.category?.join(", ")}
        </p>

        <div className="mt-3 space-y-2">
          {Object.entries(grouped).map(([date, sessions]) => (
            <SessionRow
              key={date}
              date={date}
              sessions={sessions}
              formatDate={formatDate}
              formats={formats}
            />
          ))}
        </div>
      </div>

      {!isFilmPage && isTrailerOpen && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={closeTrailer}
        >
          <div
            className="bg-white rounded-xl overflow-hidden shadow-lg max-w-3xl w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeTrailer}
              className="absolute top-3 right-3 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <iframe
              src={getEmbedURL(film.trailerURL)}
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

export default SessionCard;