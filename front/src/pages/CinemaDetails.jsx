import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select";
import { assets, cinemas, allGenres, allAgeRatings } from "../assets/assets";

const CinemaDetails = () => {
  const { id } = useParams();

  const cinema = cinemas.find(c => c._id === id);

  const [search, setSearch] = useState("");
  const [genres, setGenres] = useState([]);
  const [date, setDate] = useState("");
  const [age, setAge] = useState(null);
  const [formats, setFormats] = useState([]);

  if (!cinema) {
    return <div className="p-6">Кінотеатр не знайдено</div>;
  }

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

          <a
            href={cinema.cinemaURL}
            target="_blank"
            rel="noreferrer"
            className="mt-4 text-gray-500 hover:underline cursor-pointer transition"
          >
            Сайт кінотеатру
          </a>
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

        <div className="lg:w-3/4 w-full flex items-center justify-center min-h-[300px]">
          <p className="text-gray-400">Сеанси поки що відсутні</p>
        </div>

      </div>
    </div>
  );
};

export default CinemaDetails;