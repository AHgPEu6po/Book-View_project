import React, { useEffect, useState, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { Play, X } from "lucide-react";
import SessionCard from "../components/SessionCard";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const FilmDetails = () => {
  const { id } = useParams();
  const { backendUrl, customSelectStyles, formatDate } = useContext(AppContext);

  const [film, setFilm] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [cinemasWithSessions, setCinemasWithSessions] = useState([]);

  const [selectedCinemas, setSelectedCinemas] = useState([]);
  const [date, setDate] = useState("");
  const [formats, setFormats] = useState([]);

  const fetchFilm = async () => {
    try {
      const res = await axios.post(backendUrl + "/api/film/single", 
        { filmId: id }
      );

      if (!res.data.success) return;
      const filmData = res.data.film;
      setFilm(filmData);
      buildSessions(filmData);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCinemas = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/cinema/names");

      if (res.data.success) {
        setCinemas(res.data.cinemas);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const buildSessions = async (filmData) => {

    try {
      const requests = (filmData.lists || []).map(
        (listId) =>
          axios.post( backendUrl + "/api/sessionList/get",
            { sessionListId: listId }
          )
      );

      const responses = await Promise.all(requests);

      const result = responses
        .filter((res) => res.data.success)
        .map((res) => {

          const list = res.data.list;

          return {
            ...list.cinema_id,
            sessions: list.list || [],
          };
        });

      setCinemasWithSessions(result);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchFilm();
    fetchCinemas();
  }, [id]);

  const formatOptions = useMemo(
    () => [
      { value: "2D", label: "2D" },
      { value: "3D", label: "3D" },
      { value: "RealD", label: "RealD" },
    ],
    []
  );

  const cinemaOptions = useMemo(
    () =>
      cinemas.map((c) => ({
        value: c._id,
        label: c.name,
      })),
    [cinemas]
  );

  const filteredCinemas = useMemo(() => {

    return cinemasWithSessions
      .map((cinema) => {

        let filteredSessions = [...cinema.sessions];

        if (date) {
          filteredSessions = filteredSessions.filter(
            (s) => s.date === date
          );
        }

        if (formats.length > 0) {
          filteredSessions = filteredSessions.filter((s) =>
            formats.some(
              (f) => f.value === s.format
            )
          );
        }

        return {
          ...cinema,
          sessions: filteredSessions,
        };
      })
      .filter((cinema) => {

        const matchesCinema =
          selectedCinemas.length > 0
            ? selectedCinemas.some(
                (c) => c.value === cinema._id
              )
            : true;

        return (
          matchesCinema &&
          cinema.sessions.length > 0
        );
      });

  }, [ cinemasWithSessions, selectedCinemas, date, formats ]);

  const getEmbedURL = (url) => url.replace("watch?v=", "embed/");

  if (!film) return <div className="p-6">Фільм не знайдено</div>;

  return (
    <div className="p-6 space-y-8">

      <div className="flex flex-col md:flex-row gap-6">

        <div className="md:w-1/4">
          <img
            src={film.image}
            alt={film.name}
            className="w-full md:w-80 object-cover rounded-xl"
          />
        </div>

        <div className="md:w-1/4 relative flex flex-col justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{film.name}</h1>
            <p className="text-gray-500 mt-2">{film.category?.join(", ")}</p>
          </div>

          <div className="absolute bottom-0 left-0 mb-2 ml-2 w-10 h-10 rounded-full border-2 border-borderColor 
            bg-none flex backdrop-blur-sm items-center justify-center text-borderColor font-bold text-sm">
            {film.ageRating}
          </div>
        </div>

        <div className="md:w-2/4 flex justify-center items-center">
          <iframe
            src={getEmbedURL(film.trailerURL) + "?autoplay=1"}
            title="Trailer"
            className="w-full h-full rounded-xl"
            allowFullScreen
          />
        </div>

      </div>

      <hr className="w-full border-borderColor" />

      <div className="flex flex-col lg:flex-row gap-8">

        <div className="lg:w-1/4 w-full space-y-5 h-fit sticky top-4">
          <h2 className="font-semibold text-lg">Фільтр сеансів</h2>

          <Select
            isMulti
            options={cinemaOptions}
            value={selectedCinemas}
            onChange={setSelectedCinemas}
            placeholder="Кінотеатр"
            styles={customSelectStyles}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-borderColor px-3 py-2 text-gray-500 outline-none rounded-[15px]"
          />

          <Select
            isMulti
            options={formatOptions}
            value={formats}
            onChange={setFormats}
            placeholder="Формат"
            styles={customSelectStyles}
          />
        </div>

        <div className="lg:w-3/4 w-full space-y-6">
          {filteredCinemas.length === 0 && (
            <p className="text-gray-400 text-center">
              Сеанси поки що відсутні
            </p>
          )}

          {filteredCinemas.map((cinema) => (
            <SessionCard
              key={cinema._id}
              cinema={cinema}
              formatDate={formatDate}
              isFilmPage
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FilmDetails;