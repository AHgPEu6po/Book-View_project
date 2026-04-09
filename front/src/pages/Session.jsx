import React from "react";
import { useParams } from "react-router-dom";
import { sessions, rooms, sessionLists, cinemas, films } from "../assets/assets";
import EventCard from "../components/EventCard";

const Session = () => {
  const { id } = useParams();

  const session = sessions.find((s) => s._id === id);
  const room = rooms.find((r) => r._id === session?.room_id);

  if (!session || !room) return <div>Loading...</div>;

  const getSeatData = (rowNumber, seatNumber) => {
    return session.seats.find(
      (s) => s.row === rowNumber && s.number === seatNumber
    );
  };

  const maxSeats = Math.max(
    ...room.rows.map(row => row.seats.length)
  );

  const seatSize = 28;
  const gap = 8;

  const rowWidth =
    maxSeats * seatSize + (maxSeats - 1) * gap;

  const totalWidth = rowWidth + 60;

  const COLORS = [
    "bg-red-400 hover:bg-red-500",
    "bg-yellow-400 hover:bg-yellow-500",
    "bg-blue-400 hover:bg-blue-500",
    "bg-orange-400 hover:bg-orange-500",
    "bg-violet-400 hover:bg-violet-500",
    "bg-rose-400 hover:bg-rose-500",
    "bg-purple-400 hover:bg-purple-500",
    "bg-sky-400 hover:bg-sky-500",
    "bg-amber-400 hover:bg-amber-500",
    "bg-indigo-400 hover:bg-indigo-500",
  ];

  const priceColorMap = React.useMemo(() => {
    const uniquePrices = [
      ...new Set(session.seats.map(seat => seat.price))
    ].sort((a, b) => a - b);

    const map = {};

    uniquePrices.slice(0, 10).forEach((price, index) => {
      map[price] = COLORS[index];
    });

    return map;
  }, [session.seats]);

  const sessionList = sessionLists.find(
    (l) => l._id === session.list_id
  );

  const film = films.find(
    (f) => f._id === sessionList?.film_id
  );

  const cinema = cinemas.find(
    (c) => c._id === sessionList?.cinema_id
  );

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);

    const days = ["Нд", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
    const months = [
      "січня", "лютого", "березня", "квітня",
      "травня", "червня", "липня", "серпня",
      "вересня", "жовтня", "листопада", "грудня"
    ];

    return `${date.getDate()} ${months[date.getMonth()]}, ${days[date.getDay()]}`;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 p-6">

      <div className="overflow-x-auto pb-2">
        <div className="lg:flex-shrink-0 mx-auto" style={{ width: `${totalWidth}px` }}>

          {/* Екран */} 
          <div className="text-center mb-6 mx-auto w-full"> 
            <div className="h-2 bg-gray-300 rounded-full w-full mx-auto mb-2" /> 
            <p className="text-sm text-gray-500">Екран</p> 
          </div>

          <div className="flex flex-col items-center gap-2">

            {room.rows.map((row) => (
              <div
                key={row.rowNumber}
                className="flex items-center mx-auto w-full"
              >

                <span className="w-6 text-xs text-gray-400 text-center mr-2 ">
                  {row.rowNumber}
                </span>

                <div className="flex-1 flex justify-center">
                
                  <div
                    className="flex gap-2"
                    style={{
                      marginLeft: `${row.offset}px`,
                    }}
                  >
                    {row.seats.map((seat, index) => {
                      if (seat.type === "empty") {
                        return (
                          <div
                            key={index}
                            className="w-7 h-7"
                          />
                        );
                      }

                      const seatData = getSeatData(
                        row.rowNumber,
                        seat.number
                      );

                      const isAvailable = seatData?.isAvailable;
                      const price = seatData?.price;

                      const getColor = () => {
                        if (!isAvailable) return "bg-gray-300";

                        return priceColorMap[price] || "bg-gray-200";
                      };

                      return (
                        <div
                          key={seat.number}
                          className={`
                            w-7 h-7 rounded text-[10px] flex items-center justify-center
                            cursor-pointer transition text-black
                            ${getColor()}
                          `}
                          title={
                            isAvailable
                              ? `Ряд ${row.rowNumber}, місце ${seat.number} (${price}₴)`
                              : "Місце зайняте"
                          }
                        >
                          {isAvailable ? seat.number : ""}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <span className="w-6 text-xs text-gray-400 text-center ml-2">
                  {row.rowNumber}
                </span>

              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-4 justify-center mx-auto w-full">
            {Object.entries(priceColorMap).map(([price, color]) => (
              <div key={price} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded ${color}`} />
                <span className="text-sm text-gray-500">{price}₴</span>
              </div>
            ))}
          </div>
          
        </div>
      </div>

      <div className="flex-1 w-full p-6">

        <div className="flex flex-col gap-4 items-start">

          <div className="w-64">
            <EventCard event={film} />
          </div>

          <div className="flex flex-col gap-3 text-sm text-gray-700">

            <p>
              Дата: {formatDate(session.date)}, Час:{" "}
              <span className="font-medium text-base">
                {session.time}
              </span>
            </p>

            <p>Формат: {session.format}</p>
            <p>Кінотеатр: {cinema.name}</p>
            <p>Зал: {room.name}</p>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Session;