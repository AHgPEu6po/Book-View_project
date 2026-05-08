import React, { useEffect, useState, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { Play, X } from "lucide-react";
import SessionCard from "../components/SessionCard";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const FilmDetails = () => {
  const { id } = useParams();
  const { backendUrl } = useContext(AppContext);

  const [film, setFilm] = useState(null);
  const [cinemas, setCinemas] = useState([]);
  const [sessionsByCinema, setSessionsByCinema] = useState({});

  const [selectedCinemas, setSelectedCinemas] = useState([]);
  const [date, setDate] = useState("");
  const [formats, setFormats] = useState([]);

  const fetchFilm = async () => {
    const res = await axios.post(backendUrl + "/api/film/single", {
      filmId: id,
    });

    if (res.data.success) {
      setFilm(res.data.film);
    }
  };

  const fetchCinemas = async () => {
    const res = await axios.get(backendUrl + "/api/cinema/names");
    if (res.data.success) setCinemas(res.data.cinemas);
  };

  const buildSessions = async (filmData) => {
    const result = {};

    for (const listId of filmData.lists || []) {

      const listRes = await axios.post(
        backendUrl + "/api/sessionList/get",
        { sessionListId: listId }
      );

      if (!listRes.data.success) continue;

      const list = listRes.data.list;

      const cinemaRes = await axios.post(
        backendUrl + "/api/cinema/single",
        { cinemaId: list.cinema_id._id }
      );

      if (!cinemaRes.data.success) continue;

      const cinema = cinemaRes.data.cinema;

      const sessions = [];

      for (const sessionId of list.list || []) {

        const sessionRes = await axios.post(
          backendUrl + "/api/session/get",
          { sessionId }
        );

        if (sessionRes.data.success) {
          sessions.push(sessionRes.data.session);
        }
      }

      if (!result[cinema._id]) {
        result[cinema._id] = {
          cinema,
          sessions: [],
        };
      }
      result[cinema._id].sessions.push(...sessions);
    }
    setSessionsByCinema(result);
  };

  useEffect(() => {
    const init = async () => {
      await fetchFilm();
      await fetchCinemas();

      const res = await axios.post(backendUrl + "/api/film/single", {
        filmId: id,
      });

      if (res.data.success) {
        setFilm(res.data.film);
        await buildSessions(res.data.film);
      }
    };

    init();
  }, [id]);

  const filtered = useMemo(() => {
    return Object.values(sessionsByCinema)
      .map((item) => {
        const matchesCinema =
          selectedCinemas.length > 0
            ? selectedCinemas.some(
                (c) => c.value === item.cinema._id
              )
            : true;

        let filteredSessions = [...item.sessions];

        if (date) {
          filteredSessions = filteredSessions.filter(
            (s) => s.date === date
          );
        }

        if (formats.length > 0) {
          filteredSessions = filteredSessions.filter((s) =>
            formats.some((f) => f.value === s.format)
          );
        }

        return {
          cinema: item.cinema,
          sessions: filteredSessions,
          matchesCinema,
        };
      })
      .filter(
        (item) =>
          item.matchesCinema &&
          item.sessions.length > 0
      );
  }, [sessionsByCinema, selectedCinemas, date, formats]);

  if (!film) return <div className="p-6">Фільм не знайдено</div>;

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const months = [
      "січня","лютого","березня","квітня","травня","червня",
      "липня","серпня","вересня","жовтня","листопада","грудня"
    ];

    return `${date.getDate()} ${months[date.getMonth()]}, ${days[date.getDay()]}`;
  };

  const getEmbedURL = (url) => url.replace("watch?v=", "embed/");

  const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      borderColor: "#C4C7D2",
      borderRadius: "15px",
      boxShadow: "none",
      "&:hover": { borderColor: "none" }
    }),
    multiValue: (provided) => ({
      ...provided,
      backgroundColor: "#E5E7EB",
      borderRadius: "8px",
    }),
    placeholder: (provided) => ({
      ...provided,
      color: "#6B7280"
    }),
    multiValueRemove: (provided) => ({
      ...provided,
      borderRadius: "8px",
      cursor: "pointer",
      padding: "2px",
      "&:hover": {
        backgroundColor: "#E8A7AF",
        color: "#111827"
      }
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? "#800020"
        : state.isFocused
        ? "#E8A7AF"
        : "white",
      color: state.isSelected ? "white" : "#111827",
      cursor: "pointer",
    }),
  };

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
            options={cinemas.map((c) => ({ value: c._id, label: c.name }))}
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
            options={[
              { value: "2D", label: "2D" },
              { value: "3D", label: "3D" },
              { value: "RealD", label: "RealD" },
            ]}
            value={formats}
            onChange={setFormats}
            placeholder="Формат"
            styles={customSelectStyles}
          />
        </div>

        <div className="lg:w-3/4 w-full space-y-6">
          {filtered.length === 0 && (
            <p className="text-gray-400 text-center">
              Сеанси поки що відсутні
            </p>
          )}

          {filtered.map((item) => (
            <SessionCard
              key={item.cinema._id}
              film={film}
              cinema={{
                ...item.cinema,
                sessions: item.sessions,
              }}
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