import React, { useEffect, useState, useContext, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import SessionCard from "../components/SessionCard";
import { assets, allGenres, allAgeRatings } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const CinemaDetails = () => {
  const { id } = useParams();

  const { backendUrl, navigate, customSelectStyles, formatDate } = useContext(AppContext);

  const [cinema, setCinema] = useState(null);
  const [cinemas, setCinemas] = useState([]);

  const [filmsWithSessions, setFilmsWithSessions] = useState([]);

  const [search, setSearch] = useState("");
  const [genres, setGenres] = useState([]);
  const [date, setDate] = useState("");
  const [age, setAge] = useState(null);
  const [formats, setFormats] = useState([]);

  const buildFilms = async (cinemaData) => {

    try {
      const requests = (cinemaData.lists || []).map(
        (listId) =>
          axios.post(
            backendUrl + "/api/sessionList/get",
            {
              sessionListId: listId,
            }
          )
      );

      const responses = await Promise.all(requests);

      const result = responses
        .filter((res) => res.data.success)
        .map((res) => {
          const list = res.data.list;
          return {
            ...list.film_id,
            sessions: list.list || [],
          };
        });
      setFilmsWithSessions(result);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCinema = async () => {
    try {
      const res = await axios.post(
        backendUrl + "/api/cinema/single",
        {
          cinemaId: id,
        }
      );

      if (res.data.success) {
        setCinema(res.data.cinema);

        if (res.data.success) {
          const cinemaData = res.data.cinema;
          setCinema(cinemaData);
          buildFilms(cinemaData);
        }
      }

    } catch (error) {
      console.log(error);
    }
  };

  const fetchCinemas = async () => {
    try {
      const res = await axios.get(
        backendUrl + "/api/cinema/names"
      );

      if (res.data.success) {
        setCinemas(res.data.cinemas);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCinema();
    fetchCinemas();
  }, [id]);

  const genreOptions = useMemo(
    () =>
      allGenres.map((g) => ({
        value: g,
        label: g,
      })),
    []
  );

  const ageOptions = useMemo(
    () =>
      allAgeRatings.map((a) => ({
        value: a,
        label: a,
      })),
    []
  );

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

  const filteredFilmsWithSessions = useMemo(() => {
    return filmsWithSessions
      .map((film) => {

        let filteredSessions = [...film.sessions];

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
          ...film,
          sessions: filteredSessions,
        };
      })
      .filter((film) => {

        const matchesSearch = film.name
          .toLowerCase()
          .includes(search.toLowerCase());

        const matchesGenres =
          genres.length > 0
            ? genres.every((g) =>
                film.category?.includes(g.value)
              )
            : true;

        const getAgeNumber = (rating) =>
          parseInt(rating) || 0;

        const matchesAge = age
          ? getAgeNumber(film.ageRating) <=
            getAgeNumber(age.value)
          : true;

        return (
          matchesSearch &&
          matchesGenres &&
          matchesAge &&
          film.sessions.length > 0
        );
      });

  }, [ filmsWithSessions, search, genres, age, date, formats ]);

  if (!cinema) {
    return <div className="p-6">Кінотеатр не знайдено</div>;
  }

  const handleCinemaChange = (selected) => {
    if (selected) {
      navigate(`/cinemas/${selected.value}`);
    }
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
              options={cinemaOptions}
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
            options={genreOptions}
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
            options={ageOptions}
            value={age}
            onChange={setAge}
            placeholder="Вікове обмеження"
            isClearable
            styles={customSelectStyles}
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