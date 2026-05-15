import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const ListFilms = ({ token }) => {
  const [films, setFilms] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const fetchFilms = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/film/all");

      if (res.data.success) {
        setFilms(res.data.films);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const togglePremiere = async (filmId, isPremiere) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/film/premiere",
        { filmId, isPremiere: !isPremiere },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Оновлено");
        fetchFilms();
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  const filtered = films.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getPaginationRange = (currentPage, totalPages, delta = 2) => {
    const range = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    range.push(1);

    if (left > 2) {
      range.push("...");
    }

    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) {
      range.push("...");
    }

    if (totalPages > 1) {
      range.push(totalPages);
    }

    return range;
  };

  return (
    <div className="w-full">

      <p className="text-lg font-semibold mb-3">Список фільмів</p>

      <div className="border-y bg-gray-50 text-center py-4">
        <input
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-1/2 px-4 py-2 border rounded-full outline-none text-sm"
          placeholder="Пошук за назвою або ID"
        />
      </div>

      <div className="hidden md:grid grid-cols-[80px_2fr_1.5fr_1fr_2fr_1fr_2fr] bg-gray-100 text-sm font-semibold px-3 py-2 border">
        <div>Постер</div>
        <div>Назва</div>
        <div>ID</div>
        <div>Вік</div>
        <div>Жанри</div>
        <div className="text-center">Прем'єра</div>
        <div>Сеанси</div>
      </div>

      {paginated.map((film) => (
        <div
          key={film._id}
          className="grid grid-cols-[80px_1fr] md:grid-cols-[80px_2fr_1.5fr_1fr_2fr_1fr_2fr] items-center gap-2 px-3 py-3 border-b hover:bg-gray-50"
        >
          <img
            src={film.image}
            alt=""
            className="w-12 h-16 object-cover rounded"
          />

          <div className="font-medium truncate">{film.name}</div>

          <div className="hidden md:block text-xs text-gray-600 truncate">
            {film._id}
          </div>

          <div className="hidden md:block">{film.ageRating}</div>

          <div className="hidden md:block text-sm text-gray-700 truncate">
            {Array.isArray(film.category)
              ? film.category.join(", ")
              : film.category}
          </div>

          <div className="flex justify-center">
            <input
              type="checkbox"
              checked={film.isPremiere}
              onChange={() => togglePremiere(film._id, film.isPremiere)}
              className="w-5 h-5 cursor-pointer accent-black"
            />
          </div>

          <div className="hidden md:block text-xs text-gray-600 space-y-1">
            {film.lists?.length
              ? film.lists.map((id) => (
                  <div key={id} className="truncate">
                    {id}
                  </div>
                ))
              : "—"}
          </div>
        </div>
      ))}

      <div className="flex justify-center mt-4 gap-2">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        {getPaginationRange(currentPage, totalPages).map((page, idx) => (
          page === "..." ? (
            <span key={idx} className="px-2">
              ...
            </span>
          ) : (
            <button
              key={idx}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded ${
                currentPage === page
                  ? "bg-gray-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {page}
            </button>
          )
        ))}

        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ListFilms;