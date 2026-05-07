import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AddSessionList = ({ token }) => {
  const [cinemas, setCinemas] = useState([]);
  const [films, setFilms] = useState([]);

  const [cinema_id, setCinemaId] = useState("");
  const [film_id, setFilmId] = useState("");

  const fetchCinemas = async () => {
    try {
      const res = await axios.get(
        backendUrl + "/api/cinema/all"
      );

      if (res.data.success) {
        setCinemas(res.data.cinemas);

        if (res.data.cinemas.length > 0) {
          setCinemaId(res.data.cinemas[0]._id);
        }
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchFilms = async () => {
    try {
      const res = await axios.get(
        backendUrl + "/api/film/all"
      );

      if (res.data.success) {
        setFilms(res.data.films);

        if (res.data.films.length > 0) {
          setFilmId(res.data.films[0]._id);
        }
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCinemas();
    fetchFilms();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        backendUrl + "/api/sessionList/create",
        {
          cinema_id,
          film_id,
        },
        {
          headers: { token },
        }
      );

      if (res.data.success) {
        toast.success("Список сеансів створено");
      } else {
        toast.error(res.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="p-6">

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-5 max-w-[500px]"
      >

        <div>
          <p className="mb-2">Кінотеатр</p>

          <select
            value={cinema_id}
            onChange={(e) => setCinemaId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            {cinemas.map((cinema) => (
              <option
                key={cinema._id}
                value={cinema._id}
              >
                {cinema.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="mb-2">Фільм</p>

          <select
            value={film_id}
            onChange={(e) => setFilmId(e.target.value)}
            className="w-full border px-3 py-2 rounded"
          >
            {films.map((film) => (
              <option
                key={film._id}
                value={film._id}
              >
                {film.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="bg-black text-white py-2 rounded"
        >
          Створити список сеансів
        </button>

      </form>
    </div>
  );
};

export default AddSessionList;