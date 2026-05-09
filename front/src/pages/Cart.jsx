import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { AppContext } from "../context/AppContext";

const Cart = () => {

  const { backendUrl, token, cartItems, deleteFromCart, getCartAmount, navigate } = useContext(AppContext);
  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const fetchCartData = async () => {

      try {
        const tempData = [];
        for (const sessionId in cartItems) {
          const sessionRes = await axios.post( backendUrl + "/api/session/get",
            {
              sessionId,
            }
          );

          if (!sessionRes.data.success) continue;

          const session =
            sessionRes.data.session;

          const listRes = await axios.post( backendUrl + "/api/sessionList/get",
            {
              sessionListId: session.list_id,
            }
          );

          if (!listRes.data.success)
            continue;

          const list = listRes.data.list;
          const filmId = list.film_id?._id || list.film_id;
          const cinemaId = list.cinema_id?._id || list.cinema_id;

          const filmRes = await axios.post( backendUrl + "/api/film/single",
            {
              filmId,
            }
          );

          const cinemaRes = await axios.post( backendUrl + "/api/cinema/single",
              {
                cinemaId,
              }
            );

          tempData.push({ sessionId, session, film: filmRes.data.film, cinema: cinemaRes.data.cinema, seats: cartItems[sessionId] });
        }

        setCartData(tempData);

      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchCartData();
    }

  }, [cartItems, token, backendUrl]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const months = [
      "січня","лютого","березня","квітня","травня","червня",
      "липня","серпня","вересня","жовтня","листопада","грудня"
    ];

    return `${date.getDate()} ${
      months[date.getMonth()]
    }, ${days[date.getDay()]}`
  };

  const groupSeatsByRow = (seats) => {
    const grouped = {};
    seats.forEach((seat) => {
      if (!grouped[seat.row]) { grouped[seat.row] = [] } grouped[seat.row].push(seat)
    });
    return grouped;
  };

  const handleCheckout = async () => {
    try {

      const response = await axios.post(
        backendUrl + "/api/order/place", {}, { headers: { token } }
      );

      if (response.data.success) {

        const { session_url, orderIds } = response.data;
        localStorage.setItem("orderIds", JSON.stringify(orderIds));
        window.location.replace(session_url);

      } else {
        alert(response.data.message);
      }

    } catch (error) {
      console.log(error);
    }
  };

  if (!token) {
    return (
      <div className="p-6 text-center text-gray-500">
        Увійдіть в акаунт
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Кошик
        </h1>
      </div>

      {cartData.length === 0 ? (
        <div className="border border-borderColor rounded-2xl p-10 text-center">
          <p className="text-gray-500">
            Кошик порожній
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {cartData.map((item) => {
            const groupedSeats = groupSeatsByRow(item.seats);

            const sessionTotal = item.seats.reduce((sum, seat) => sum + seat.price, 0)

            return (
              <div
                key={item.sessionId}
                className="border border-borderColor rounded-2xl p-6 space-y-6"
              >

                <div className="flex flex-col lg:flex-row gap-6">
                  <img src={item.film.image} alt="" className="w-32 h-44 object-cover rounded-xl"/>

                  <div className="flex-1 space-y-3">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {item.film.name}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        {item.cinema.name}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="bg-gray-100 rounded-xl px-4 py-2">
                        {formatDate( item.session.date )}
                      </div>

                      <div className="bg-gray-100 rounded-xl px-4 py-2">
                        {item.session.time}
                      </div>

                      <div className="bg-gray-100 rounded-xl px-4 py-2">
                        {item.session.format}
                      </div>

                    </div>

                    <div className="space-y-4 pt-2">
                      {Object.entries( groupedSeats ).map(([row, seats]) => (
                          <div
                            key={row}
                            className="border border-gray-200 rounded-xl p-4"
                          >
                            <div className="mb-3">
                              <p className="font-medium">
                                Ряд {row}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-3">
                              {seats.map((seat) => (
                                  <div
                                    key={`${seat.row}-${seat.number}`}
                                    className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2"
                                  >
                                    <div>
                                      <p className="text-sm">
                                        Місце{" "}
                                        <span className="font-medium">
                                          {seat.number}
                                        </span>
                                      </p>

                                      <p className="text-xs text-gray-500">
                                        {seat.price}₴
                                      </p>
                                    </div>

                                    <button
                                      onClick={() => deleteFromCart( item.sessionId, seat )}
                                      className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-100 transition"
                                    >
                                      <Trash2 size={16}  className="text-red-500"/>
                                    </button>
                                  </div>
                                )
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex lg:flex-col justify-between items-end min-w-[140px]">

                    <div className="text-right">
                      <p className="text-sm text-gray-500">
                        Разом
                      </p>

                      <p className="text-3xl font-bold">
                        {sessionTotal}₴
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="flex justify-end pt-4">
            <div className="w-full sm:w-[420px] border border-borderColor rounded-2xl p-6 space-y-5">
              <div className="flex justify-between items-center">
                <p className="text-lg text-gray-600">
                  Квитків
                </p>

                <p className="text-lg font-medium">
                  {Object.values(cartItems).flat().length}
                </p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-lg text-gray-600">
                  Загальна сума
                </p>

                <p className="text-3xl font-bold">
                  {getCartAmount()}₴
                </p>
              </div>

              <button onClick={handleCheckout}
                className="w-full bg-primary hover:bg-primary-dull transition text-white py-4 rounded-xl font-medium"
              >
                Перейти до оплати
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;