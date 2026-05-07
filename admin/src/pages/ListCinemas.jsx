import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const ListCinemas = ({ token }) => {
  const [cinemas, setCinemas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  const fetchCinemas = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/cinema/all");

      if (res.data.success) {
        setCinemas(res.data.cinemas);
      } else {
        toast.error(res.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  const filtered = cinemas.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c._id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const paginated = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="w-full">

      <p className="text-lg font-semibold mb-3">Список кінотеатрів</p>

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

      <div className="hidden md:grid grid-cols-[80px_2fr_1.5fr_1fr_1fr_2fr_2fr] bg-gray-100 text-sm font-semibold px-3 py-2 border">
        <div>Фото</div>
        <div>Назва</div>
        <div>ID</div>
        <div>Місто</div>
        <div>Район</div>
        <div>Зали</div>
        <div>Сеанси</div>
      </div>

      {paginated.map((cinema) => (
        <div
          key={cinema._id}
          className="grid grid-cols-[80px_1fr] md:grid-cols-[80px_2fr_1.5fr_1fr_1fr_2fr_2fr] items-center gap-2 px-3 py-3 border-b hover:bg-gray-50"
        >

          <img
            src={cinema.image}
            alt=""
            className="w-12 object-cover rounded"
          />

          <div className="font-medium truncate">{cinema.name}</div>

          <div className="hidden md:block text-xs text-gray-600 truncate">
            {cinema._id}
          </div>

          <div className="hidden md:block">{cinema.city}</div>

          <div className="hidden md:block">{cinema.district}</div>

          <div className="hidden md:block text-xs text-gray-600 space-y-1 break-words">
            {cinema.rooms?.length > 0
              ? cinema.rooms.map((id) => (
                  <div key={id} className="bg-gray-100 px-2 py-0.5 rounded">
                    {id}
                  </div>
                ))
              : "—"}
          </div>

          <div className="hidden md:block text-xs text-gray-600 space-y-1 break-words">
            {cinema.lists?.length > 0
              ? cinema.lists.map((id) => (
                  <div key={id} className="bg-gray-100 px-2 py-0.5 rounded">
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

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1
                ? "bg-gray-500 text-white"
                : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
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

export default ListCinemas;