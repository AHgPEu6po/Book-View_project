import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const History = () => {
  const { backendUrl, token } = useContext(AppContext);

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(
        backendUrl + "/api/user/history",
        { headers: { token } }
      );

      if (!res.data.success) {
        setLoading(false);
        return;
      }

      const historyData = res.data.user.history || [];

      const formattedHistory = await Promise.all(
        historyData.map(async (item) => {
          try {
            const filmRes = await axios.post(
              backendUrl + "/api/film/single",
              { filmId: item.film_id }
            );

            if (!filmRes.data.success) return null;

            return {
              film: filmRes.data.film,
              sessionDate: item.sessionDate,
              rating: item.rating
            };
          } catch (error) {
            console.log(error);
            return null;
          }
        })
      );

      setHistory(
        formattedHistory.filter(Boolean).reverse()
      );

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistory();
    }
  }, [token]);

  const rateFilm = async ( filmId, sessionDate, rating ) => {
    try {

      const res = await axios.post(
        backendUrl + "/api/user/history/rate",
        { filmId, sessionDate, rating },
        { headers: { token } }
      );

      if (res.data.success) {

        setHistory((prev) =>
          prev.map((item) => {

            if (
              item.film._id === filmId &&
              item.sessionDate === sessionDate
            ) {
              return {
                ...item,
                rating,
              };
            }

            return item;
          })
        );
      }

    } catch (error) {
      console.log(error);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const months = [
      "січня","лютого","березня","квітня","травня","червня",
      "липня","серпня","вересня","жовтня","листопада","грудня"
    ];

    return `${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}, ${
      days[date.getDay()]
    }`;
  };

  if (!token) {
    return (
      <div className="p-6 text-center text-gray-500">
        Увійдіть в акаунт
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Завантаження...
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Історія переглядів
        </h1>
      </div>

      {history.length === 0 ? (
        <div className="border border-borderColor rounded-2xl p-10 text-center text-gray-500">
          Історія порожня
        </div>
      ) : (
        <div className="space-y-5">

          {history.map((item, index) => (
            <div key={index} className="border border-borderColor rounded-2xl p-5 flex flex-col md:flex-row gap-5">

              <img src={item.film.image} alt={item.film.name} className="w-full md:w-40 h-60 object-cover rounded-xl"/>

              <div className="flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {item.film.name}
                    </h2>

                    <p className="text-gray-500 mt-1">
                      {formatDate(item.sessionDate)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {item.film.category.map((genre) => (
                      <span key={genre} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                        {genre}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <span className="font-medium">
                      Ваша оцінка:
                    </span>

                    {item.rating ? (
                      <div className="px-3 py-1 rounded-lg bg-green-100 text-green-700">
                        {item.rating}/10
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        {[1,2,3,4,5,6,7,8,9,10].map((num) => (
                          <button key={num} onClick={() => rateFilm(
                              item.film._id, item.sessionDate, num
                            )}
                            className="w-9 h-9 rounded-lg border hover:bg-black hover:text-white transition"
                          >
                            {num}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;