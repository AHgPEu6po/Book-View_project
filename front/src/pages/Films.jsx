import React, { useState } from "react";
import Select from "react-select";
import { films, assets, allGenres, allCinemaNames, allAgeRatings } from "../assets/assets";
import EventCard from "../components/EventCard";

const Films = () => {
  const [search, setSearch] = useState("");
  const [selectedCinemas, setSelectedCinemas] = useState([]);
  const [age, setAge] = useState(null);
  const [genres, setGenres] = useState([]);
  const [onlyPremiere, setOnlyPremiere] = useState(false);

  const filteredFilms = films.filter((film) => {
    const matchesSearch = film.name
      .toLowerCase()
      .includes(search.toLowerCase());

    // заглушка
    const matchesCinema =
      selectedCinemas.length > 0 ? true : true;
    
    const getAgeNumber = (rating) => parseInt(rating) || 0;

    const matchesAge = age
      ? getAgeNumber(film.ageRating) <= getAgeNumber(age.value)
      : true;
    
      const matchesGenres =
      genres.length > 0
        ? genres.some((g) => film.category?.includes(g.value))
        : true;

    const matchesPremiere = onlyPremiere
      ? film.isPremiere === true
      : true;

    return (
      matchesSearch &&
      matchesCinema &&
      matchesAge &&
      matchesGenres &&
      matchesPremiere
    );
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
    <div className="flex flex-col lg:flex-row gap-8 p-6">

      <div className="lg:w-1/4 w-full space-y-6 sticky top-4 h-fit">

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
          options={allCinemaNames.map(name => ({ value: name, label: name }))}
          value={selectedCinemas}
          onChange={setSelectedCinemas}
          placeholder="Кінотеатр"
          styles={customSelectStyles}
        />

        <Select
          isMulti
          options={allGenres.map(g => ({ value: g, label: g }))}
          value={genres}
          onChange={setGenres}
          placeholder="Жанри"
          styles={customSelectStyles}
        />

        <Select
          options={allAgeRatings.map(a => ({ value: a, label: a }))}
          value={age}
          onChange={setAge}
          placeholder="Вікове обмеження"
          isClearable
          styles={customSelectStyles}
        />

        <div
          onClick={() => setOnlyPremiere(!onlyPremiere)}
          className="flex items-center justify-between cursor-pointer"
        >
          <span className="text-gray-500">Тільки прем'єри</span>

          <div className={`w-11 h-6 flex items-center rounded-full p-1 transition
            ${onlyPremiere ? "bg-[#800020]" : "bg-gray-300"}`}>

            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition
              ${onlyPremiere ? "translate-x-5" : "translate-x-0"}`} />
          </div>
        </div>
      </div>

      <div className="lg:w-3/4 w-full">
        {filteredFilms.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredFilms.map((film) => (
              <EventCard key={film._id} event={film} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">Нічого не знайдено</p>
        )}
      </div>
    </div>
  );
};

export default Films;