import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const MyTickets = () => {
  const { backendUrl, token } = useContext(AppContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await axios.get( 
        backendUrl + "/api/order/user", { headers: { token } }
      );

      if (response.data.success) {
        setOrders(response.data.orders);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

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

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";

      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "paid":
        return "Оплачено";

      case "pending":
        return "Очікує оплату";

      case "cancelled":
        return "Скасовано";

      default:
        return status;
    }
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
          Мої квитки
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="border border-borderColor rounded-2xl p-10 text-center text-gray-500">
          У вас поки немає квитків
        </div>
      ) : (
        <div className="space-y-6">

          {orders.map((order) => {

            const groupedSeats = {};
            order.seats.forEach((seat) => {
              if (!groupedSeats[seat.row]) {
                groupedSeats[seat.row] = [];
              }
              groupedSeats[seat.row].push(seat.number);
            });

            return (
              <div
                key={order._id}
                className="border border-borderColor rounded-2xl p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex gap-5">
                    <img
                      src={order.film_id.image}
                      alt={order.film_id.name}
                      className="w-28 h-40 object-cover rounded-xl"
                    />

                    <div className="space-y-3">
                      <div>
                        <h2 className="text-2xl font-semibold">
                          {order.film_id.name}
                        </h2>

                        <p className="text-gray-500 mt-1">
                          {order.session_id.format}
                        </p>
                      </div>

                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          Дата:{" "}
                          <span className="font-medium">
                            {formatDate(order.session_id.date)}
                          </span>
                        </p>

                        <p>
                          Час:{" "}
                          <span className="font-medium">
                            {order.session_id.time}
                          </span>
                        </p>

                        <p>
                          Кінотеатр:{" "}
                          <span className="font-medium">
                            {
                              order.session_id.list_id?.cinema_id?.name
                            }
                          </span>
                        </p>

                        <p>
                          Квитків:{" "}
                          <span className="font-medium">
                            {order.seats.length}
                          </span>
                        </p>
                      </div>

                      <div className="space-y-2">
                        {Object.entries(groupedSeats).map(
                          ([row, seats]) => (
                            <div key={row} className="text-sm">
                              <span className="font-medium">
                                Ряд {row}:
                              </span>{" "}

                              <span className="text-gray-600">
                                місця {seats.join(", ")}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-start lg:items-end gap-4">
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>

                    <div className="text-right">
                      <p className="text-gray-500 text-sm">
                        Загальна сума
                      </p>

                      <p className="text-2xl font-bold">
                        {order.totalPrice}₴
                      </p>
                    </div>

                    <p className="text-xs text-gray-400">
                      Замовлення #{order._id.slice(-6)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTickets;