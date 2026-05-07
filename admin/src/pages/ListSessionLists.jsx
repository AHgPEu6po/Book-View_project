import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { Trash2, Plus } from "lucide-react";

const ListSessionLists = ({ token }) => {
  const [lists, setLists] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [groupBy, setGroupBy] = useState("film");

  const [selectedList, setSelectedList] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [rooms, setRooms] = useState([]);

  const [sessionForm, setSessionForm] = useState({
    room_id: "",
    date: "",
    time: "",
    format: "2D",
  });

  const openSessionModal = async (list) => {
    try {
      setSelectedList(list);

      const cinemaId =
        typeof list.cinema_id === "object"
          ? list.cinema_id._id
          : list.cinema_id;

      const cinemaRes = await axios.post(
        backendUrl + "/api/cinema/single",
        { cinemaId }
      );

      if (!cinemaRes.data.success) {
        return toast.error(cinemaRes.data.message);
      }

      const roomIds = cinemaRes.data.cinema.rooms || [];

      const roomRequests = roomIds.map((roomId) =>
        axios.post(
          backendUrl + "/api/room/get",
          { roomId }
        )
      );

      const roomResponses = await Promise.all(roomRequests);

      const fullRooms = roomResponses
        .filter((r) => r.data.success)
        .map((r) => r.data.room);

      setRooms(fullRooms);

      setSessionForm({
        room_id: fullRooms?.[0]?._id || "",
        date: "",
        time: "",
        format: "2D",
      });

      setIsModalOpen(true);

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const fetchLists = async () => {
    try {
      const res = await axios.get(
        backendUrl + "/api/sessionList/all", { headers: { token }, }
      );

      if (res.data.success) {
        setLists(res.data.lists);
      } else {
        toast.error(res.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const deleteSessionList = async (sessionListId) => {
    try {

      const res = await axios.post(
        backendUrl + "/api/sessionList/delete",
        { sessionListId },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("SessionList видалено");

        fetchLists();
      } else {
        toast.error(res.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const createSession = async () => {
    try {

      const res = await axios.post(
        backendUrl + "/api/session/create",
        {
          list_id: selectedList._id,
          room_id: sessionForm.room_id,
          date: sessionForm.date,
          time: sessionForm.time,
          format: sessionForm.format,
        },
        { headers: { token } }
      );

      if (res.data.success) {

        toast.success("Сеанс створено");

        setIsModalOpen(false);

        fetchLists();

      } else {
        toast.error(res.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      const res = await axios.post(
        backendUrl + "/api/session/delete",
        { sessionId },
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Сеанс видалено");
        fetchLists();
      } else {
        toast.error(res.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const filteredLists = useMemo(() => {
    return lists.filter((item) =>
      item._id
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [lists, searchTerm]);

  const groupedLists = useMemo(() => {
    return filteredLists.reduce((acc, item) => {

      const key =
        groupBy === "film"
          ? item.film_id?.name || "Без фільму"
          : item.cinema_id?.name || "Без кінотеатру";

      if (!acc[key]) {
        acc[key] = [];
      }

      acc[key].push(item);

      return acc;
    }, {});
  }, [filteredLists, groupBy]);

  return (
    <div className="p-6">

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">

        <h1 className="text-2xl font-semibold">
          Списки сеансів
        </h1>

        <div className="flex gap-3">

          <input
            type="text"
            placeholder="Пошук за ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-4 py-2 rounded-lg w-72"
          />

          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
            className="border px-4 py-2 rounded-lg"
          >
            <option value="film">
              Групувати за фільмом
            </option>

            <option value="cinema">
              Групувати за кінотеатром
            </option>
          </select>

        </div>
      </div>

      <div className="flex flex-col gap-8">

        {Object.entries(groupedLists).map(
          ([groupName, items]) => (
            <div key={groupName}>

              <div className="mb-4">
                <h2 className="text-xl font-bold border-b pb-2">
                  {groupName}
                </h2>
              </div>

              <div className="flex flex-col gap-4">

                {items.map((list) => (
                  <div
                    key={list._id}
                    className="
                      flex gap-4 p-4 border border-gray-200
                      rounded-xl hover:bg-gray-50 transition
                    "
                  >

                    <img
                      src={
                        groupBy === "film"
                          ? list.cinema_id?.image
                          : list.film_id?.image
                      }
                      alt=""
                      className="
                        w-28 h-36 object-cover rounded-lg
                      "
                    />

                    <div className="flex flex-col flex-1">

                      <div className="flex items-center justify-between">

                        <h3 className="text-lg font-semibold">

                          {groupBy === "film"
                            ? list.cinema_id?.name
                            : list.film_id?.name}

                        </h3>

                        <div className="flex gap-4">
                          <div className="
                            text-xs bg-gray-200 px-2 py-1 rounded
                          ">
                            {list._id}
                          </div>

                          <button
                            onClick={() => openSessionModal(list)}
                            className="
                              p-2 rounded-lg border border-green-200
                              text-green-600 hover:bg-green-50 transition
                            "
                          >
                            <Plus className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => deleteSessionList(list._id)}
                            className="
                              p-2 rounded-lg border border-red-200
                              text-red-500 hover:bg-red-50 transition
                            "
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>

                      <div className="mt-2 flex flex-col gap-1 text-sm text-gray-600">

                        <p>
                          <span className="font-medium">
                            Кінотеатр:
                          </span>{" "}
                          {list.cinema_id?.name}
                        </p>

                        <p>
                          <span className="font-medium">
                            Фільм:
                          </span>{" "}
                          {list.film_id?.name}
                        </p>

                        <p>
                          <span className="font-medium">
                            Сеансів:
                          </span>{" "}
                          {list.list?.length || 0}
                        </p>

                      </div>

                      <div className="mt-4 flex flex-col gap-3">

                        {list.list?.length > 0 ? (() => {

                          const groupedSessions = list.list
                          .sort((a, b) => {

                            const dateA = new Date(`${a.date}T${a.time}`);
                            const dateB = new Date(`${b.date}T${b.time}`);

                            return dateA - dateB;

                          })
                          .reduce((acc, session) => {

                            if (!acc[session.date]) {
                              acc[session.date] = [];
                            }

                            acc[session.date].push(session);

                            return acc;

                          }, {});

                          return Object.entries(groupedSessions).map(
                            ([date, sessions]) => (
                              <div
                                key={date}
                                className="flex items-start gap-6"
                              >

                                <span className="text-sm text-gray-600 min-w-[120px]">
                                  {date}
                                </span>

                                <div className="flex flex-wrap gap-2">

                                  {sessions.map((session) => (
                                    <div
                                      key={session._id}
                                      className="
                                        px-4 py-1.5 rounded-full
                                        border border-gray-300
                                        text-sm bg-white flex gap-4
                                      "
                                      title={`Формат: ${session.format}`}
                                    >
                                      <div>
                                        {session.time}
                                      </div>

                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          deleteSession(session._id);
                                        }}
                                        className="
                                          p-2 rounded-lg border border-red-200
                                          text-red-500 hover:bg-red-50 transition
                                        "
                                      >
                                        <Trash2 className="w-2 h-2" />
                                      </button>
                                    </div>
                                  ))}

                                </div>

                              </div>
                            )
                          );

                        })() : (
                          <div className="text-sm text-gray-400">
                            Немає сеансів
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>

      {isModalOpen && (
        <div
          className="
            fixed inset-0 bg-black/50 z-50
            flex items-center justify-center p-4
          "
          onClick={() => setIsModalOpen(false)}
        >

          <div
            className="
              bg-white rounded-2xl p-6
              w-full max-w-lg shadow-xl
            "
            onClick={(e) => e.stopPropagation()}
          >

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-2xl font-semibold">
                  Додати сеанс
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  SessionList: {selectedList?._id}
                </p>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="
                  w-9 h-9 rounded-full border
                  flex items-center justify-center
                  hover:bg-gray-100 transition
                "
              >
                ✕
              </button>

            </div>

            <div className="flex flex-col gap-5">

              <div>
                <p className="text-sm mb-2 font-medium">
                  Зал
                </p>

                <select
                  value={sessionForm.room_id}
                  onChange={(e) =>
                    setSessionForm((prev) => ({
                      ...prev,
                      room_id: e.target.value,
                    }))
                  }
                  className="
                    w-full border rounded-xl
                    px-4 py-3 outline-none
                    focus:border-black transition
                  "
                >

                  {rooms.map((room) => (
                    <option key={room._id} value={room._id}>
                      {room.name}
                    </option>
                  ))}

                </select>
              </div>

              <div>
                <p className="text-sm mb-2 font-medium">
                  Дата
                </p>

                <input
                  type="date"
                  value={sessionForm.date}
                  onChange={(e) =>
                    setSessionForm((prev) => ({
                      ...prev,
                      date: e.target.value,
                    }))
                  }
                  className="
                    w-full border rounded-xl
                    px-4 py-3 outline-none
                    focus:border-black transition
                  "
                />
              </div>

              <div>
                <p className="text-sm mb-2 font-medium">
                  Час
                </p>

                <input
                  type="time"
                  value={sessionForm.time}
                  onChange={(e) =>
                    setSessionForm((prev) => ({
                      ...prev,
                      time: e.target.value,
                    }))
                  }
                  className="
                    w-full border rounded-xl
                    px-4 py-3 outline-none
                    focus:border-black transition
                  "
                />
              </div>

              <div>
                <p className="text-sm mb-2 font-medium">
                  Формат
                </p>

                <select
                  value={sessionForm.format}
                  onChange={(e) =>
                    setSessionForm((prev) => ({
                      ...prev,
                      format: e.target.value,
                    }))
                  }
                  className="
                    w-full border rounded-xl
                    px-4 py-3 outline-none
                    focus:border-black transition
                  "
                >
                  <option value="2D">2D</option>
                  <option value="3D">3D</option>
                  <option value="RealD">RealD</option>
                </select>
              </div>

            </div>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => setIsModalOpen(false)}
                className="
                  px-5 py-2.5 rounded-xl border
                  hover:bg-gray-100 transition
                "
              >
                Скасувати
              </button>

              <button
                onClick={createSession}
                className="
                  px-5 py-2.5 rounded-xl
                  bg-black text-white
                  hover:opacity-90 transition
                "
              >
                Створити
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListSessionLists;