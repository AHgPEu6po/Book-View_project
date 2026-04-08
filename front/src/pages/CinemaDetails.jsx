import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import SessionCard from "../components/SessionCard";
import { assets, cinemas, allGenres, allAgeRatings, sessionLists, sessions, films } from "../assets/assets";

const CinemaDetails = () => {
  const { id } = useParams();

  const cinema = cinemas.find(c => c._id === id);

  const [search, setSearch] = useState("");
  const [genres, setGenres] = useState([]);
  const [date, setDate] = useState("");
  const [age, setAge] = useState(null);
  const [formats, setFormats] = useState([]);

  const navigate = useNavigate();

  if (!cinema) {
    return <div className="p-6">Кінотеатр не знайдено</div>;
  }

  const handleCinemaChange = (selected) => {
    if (selected) {
      navigate(`/cinemas/${selected.value}`);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const months = [
      "січня","лютого","березня","квітня","травня","червня",
      "липня","серпня","вересня","жовтня","листопада","грудня"
    ];

    return `${date.getDate()} ${months[date.getMonth()]}, ${days[date.getDay()]}`;
  };

  const cinemaLists = sessionLists.filter(
    (l) => l.cinema_id === cinema._id
  );

  const filmsWithSessions = cinemaLists.map((list) => {
    const film = films.find((f) => f._id === list.film_id);

    let filmSessions = sessions
      .filter((s) => s.list_id === list._id)
      .sort((a, b) => a.time.localeCompare(b.time));

    if (date) {
      filmSessions = filmSessions.filter((s) => s.date === date);
    }

    if (formats.length > 0) {
      filmSessions = filmSessions.filter((s) =>
        formats.some((f) => f.value === s.format)
      );
    }

    return {
      ...film,
      sessions: filmSessions,
    };
  });

    const filteredFilmsWithSessions = filmsWithSessions.filter((film) => {
    const matchesSearch = film.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesGenres =
      genres.length > 0
        ? genres.every((g) => film.category?.includes(g.value))
        : true;

    const getAgeNumber = (rating) => parseInt(rating) || 0;
    const matchesAge = age
      ? getAgeNumber(film.ageRating) <= getAgeNumber(age.value)
      : true;

    return matchesSearch && matchesGenres && matchesAge;
  });

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
        <img
          src={cinema.image}
          alt={cinema.name}
          className="w-full md:w-80 object-cover rounded-xl"
        />

        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-2xl font-bold">{cinema.name}</h1>
            <p className="text-gray-500 mt-2">{cinema.address}</p>
          </div>

          <div>
            <a
              href={cinema.cinemaURL}
              target="_blank"
              rel="noreferrer"
              className="mt-4 text-gray-500 hover:underline cursor-pointer transition"
            >
              Сайт кінотеатру
            </a>

            <Select
              className="mt-3"
              options={cinemas.map(c => ({
                value: c._id,
                label: c.name
              }))}
              value={{ value: cinema._id, label: cinema.name }}
              onChange={handleCinemaChange}
              styles={customSelectStyles}
              isSearchable
            />
          </div>
        </div>
      </div>

      <hr className="w-full border-borderColor"/>

      <div className="flex flex-col lg:flex-row gap-8">

        <div className="lg:w-1/4 w-full space-y-5 h-fit sticky top-4">

          <h2 className="font-semibold text-lg">Фільтр сеансів</h2>

          <div className="flex gap-2 border border-borderColor px-3 rounded-full">
            <input
              type="text"
              placeholder="Назва фільму"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
            />
            <img className="hidden lg:flex" src={assets.search} alt="" />
          </div>

          <Select
            isMulti
            options={allGenres.map(g => ({ value: g, label: g }))}
            value={genres}
            onChange={setGenres}
            placeholder="Жанри"
            styles={customSelectStyles}
          />

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border border-borderColor rounded-[15px] px-3 py-2 text-gray-500 outline-none"
          />

          <Select
            options={allAgeRatings.map(a => ({ value: a, label: a }))}
            value={age}
            onChange={setAge}
            placeholder="Вікове обмеження"
            isClearable
            styles={customSelectStyles}
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
          {filteredFilmsWithSessions.length === 0 && (
            <p className="text-gray-400 text-center">Сеанси поки що відсутні</p>
          )}

          {filteredFilmsWithSessions.map((film) => (
            <SessionCard
              key={film._id}
              film={film}
              formatDate={formatDate}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default CinemaDetails;