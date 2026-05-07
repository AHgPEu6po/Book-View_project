import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const AddRoom = ({ token }) => {
  const [cinemas, setCinemas] = useState([]);

  const [cinema_id, setCinemaId] = useState("");
  const [name, setName] = useState("");
  const [rowsCount, setRowsCount] = useState(5);

  const [roomPreview, setRoomPreview] = useState({ rows: [] });

  const fetchCinemas = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/cinema/names");
  
      if (res.data.success) {
        setCinemas(res.data.cinemas);
  
        setCinemaId(res.data.cinemas[0]._id);
      }
  
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCinemas();
  }, []);

  useEffect(() => {
    const rows = [];

    for (let i = 1; i <= rowsCount; i++) {
      const seatsCount = 10;

      rows.push({
        rowNumber: i,
        offset: 0,
        seatsCount,
        seats: Array.from({ length: seatsCount }, (_, j) => ({
          number: j + 1,
          type: "standard",
        })),
      });
    }

    setRoomPreview({ rows });
  }, [rowsCount]);

  const updateOffset = (rowIndex, value) => {
    setRoomPreview((prev) => {
      const rows = [...prev.rows];
      rows[rowIndex].offset = value;
      return { ...prev, rows };
    });
  };

  const updateSeatsCount = (rowIndex, value) => {
    setRoomPreview((prev) => {
      const rows = [...prev.rows];
      const count = Number(value);

      rows[rowIndex].seatsCount = count;

      rows[rowIndex].seats = Array.from({ length: count }, (_, j) => ({
        number: j + 1,
        type: "standard",
      }));

      return { ...prev, rows };
    });
  };

  const toggleSeat = (rowIndex, seatIndex) => {
    setRoomPreview((prev) => {
      const rows = [...prev.rows];

      rows[rowIndex].seats = rows[rowIndex].seats.map((seat, idx) => {
        if (idx === seatIndex) {
          return {
            ...seat,
            type: seat.type === "empty" ? "standard" : "empty",
          };
        }
        return seat;
      });

      let counter = 1;

      rows[rowIndex].seats = rows[rowIndex].seats.map((seat) => {
        if (seat.type === "empty") {
          return { ...seat, number: null };
        }

        return {
          ...seat,
          number: counter++,
        };
      });

      return { ...prev, rows };
    });
  };

  const totalWidth =
    Math.max(...roomPreview.rows.map((r) => r.seats.length || 0)) * 32;

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        backendUrl + "/api/room/create",
        {
          cinema_id,
          name,
          rows: roomPreview.rows,
        },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Зал створено");
      } else {
        toast.error(res.data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 p-6">

      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col gap-4 w-full lg:w-1/3"
      >
        <div>
          <p>Кінотеатр</p>
          <select
            value={cinema_id}
            onChange={(e) => setCinemaId(e.target.value)}
            className="w-full px-3 py-2 border"
          >
            {cinemas.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p>Назва залу</p>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border"
            placeholder="Зал 1"
          />
        </div>

        <div>
          <p>Кількість рядів</p>
          <input
            type="number"
            value={rowsCount}
            onChange={(e) => setRowsCount(Number(e.target.value))}
            className="w-full px-3 py-2 border"
            min={1}
          />
        </div>

        <button className="bg-black text-white py-2 mt-4 rounded">
          Створити зал
        </button>
      </form>

      <div className="flex-1 flex gap-6 overflow-x-auto">

        <div className="flex flex-col">
          {roomPreview.rows.map((row, index) => (
            <div key={row.rowNumber} className="flex items-center gap-2 p-2">

              <span className="w-3 text-xs text-gray-400">
                {row.rowNumber}
              </span>

              <select
                value={row.offset}
                onChange={(e) =>
                  updateOffset(index, Number(e.target.value))
                }
                className="w-10 h-7 text-xs border rounded text-center"
              >
                <option value={0}>0</option>
                <option value={0.5}>0.5</option>
              </select>

              <input
                type="number"
                value={row.seatsCount}
                min={1}
                onChange={(e) =>
                  updateSeatsCount(index, e.target.value)
                }
                className="w-10 h-7 text-xs border rounded text-center"
              />

            </div>
          ))}
        </div>

        <div className="flex-1 overflow-x-auto pb-2">

        <div
            className="lg:flex-shrink-0 mx-auto"
            style={{ width: `${totalWidth}px` }}
        >

            <div className="text-center mb-6 mx-auto w-full">
                <div className="h-2 bg-gray-300 rounded-full w-full mx-auto mb-2" />
                <p className="text-sm text-gray-500">Екран</p>
                </div>

                <div className="flex flex-col items-center gap-2">

                {roomPreview.rows.map((row, rowIndex) => (
                    <div
                    key={row.rowNumber}
                    className="flex items-center mx-auto w-full"
                    >

                    <span className="w-6 text-xs text-gray-400 text-center mr-2">
                        {row.rowNumber}
                    </span>

                    <div className="flex-1 flex justify-center">
                        <div
                        className="flex gap-2"
                        style={{
                            marginLeft: `${row.offset * 30}px`,
                        }}
                        >
                        {row.seats.map((seat, seatIndex) => {
                            return (
                                <div
                                key={seatIndex}
                                onClick={() => toggleSeat(rowIndex, seatIndex)}
                                className={`
                                    w-7 h-7 rounded text-[10px]
                                    flex items-center justify-center cursor-pointer
                                    ${seat.type === "empty" ? "bg-gray-300" : "bg-gray-200"}
                                `}
                                >
                                {seat.type === "empty" ? "" : seat.number}
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

            </div>
        </div>

      </div>
    </div>
  );
};

export default AddRoom;