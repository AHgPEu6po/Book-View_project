import fs from "fs";
import path from "path";

import filmModel from "../../models/filmModel.js";
import cinemaModel from "../../models/cinemaModel.js";
import sessionListModel from "../../models/sessionListModel.js";
import sessionModel from "../../models/sessionModel.js";
import roomModel from "../../models/roomModel.js";

const ROOM_ID = "69fa5652471313b844a99cac";

const formats = ["2D", "3D", "RealD"];
const sessionTimes = ["10:00", "12:00", "14:00", "16:00", "18:00"];

const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randomItem = (arr) =>
  arr[rand(0, arr.length - 1)];

const shuffle = (arr) =>
  [...arr].sort(() => Math.random() - 0.5);

const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

const generateSeats = (room) => {
  const result = [];

  room.rows.forEach((row, rowIndex) => {

    row.seats.forEach((seat, seatIndex) => {

      if (seat.type === "empty") return;

      let basePrice = 120;

      if (rowIndex > 10) basePrice += 40;
      else if (rowIndex > 5) basePrice += 20;

      const center = row.seats.length / 2;

      if (Math.abs(seatIndex - center) < 3) {
        basePrice += 30;
      }

      result.push({
        row: row.rowNumber,
        number: seat.number,
        isAvailable: true,
        price: basePrice,
      });
    });
  });

  return result;
};

const createSessionsForList = async (listId, room) => {

  const createdSessions = [];

  for (let dayOffset = 0; dayOffset < 3; dayOffset++) {

    const date = new Date();
    date.setDate(date.getDate() + dayOffset);

    const formattedDate = formatDate(date);

    for (const time of sessionTimes) {

      const session = await sessionModel.create({
        list_id: listId,
        date: formattedDate,
        time,
        format: randomItem(formats),
        room_id: ROOM_ID,
        seats: generateSeats(room),
      });

      createdSessions.push(session._id);
    }
  }

  await sessionListModel.findByIdAndUpdate(listId, {
    $push: {
      list: { $each: createdSessions }
    }
  });
};

export const generateSessionSeed = async () => {

  await sessionModel.deleteMany();
  await sessionListModel.deleteMany();

  await filmModel.updateMany({}, { lists: [] });
  await cinemaModel.updateMany({}, { lists: [] });

  const hiddenDataPath = path.join(
    process.cwd(),
    "data",
    "filmHiddenData.json"
  );

  const hiddenData = JSON.parse(
    fs.readFileSync(hiddenDataPath, "utf-8")
  );

  const selectedFilmsIds = shuffle(hiddenData)
    .slice(0, 50)
    .map((item) => item.film_id);

  const films = await filmModel.find({
    _id: { $in: selectedFilmsIds }
  });

  const cinemas = await cinemaModel.find();

  const room = await roomModel.findById(ROOM_ID);

  if (!room) {
    throw new Error("Room not found");
  }

  const kyivCinemas = cinemas.filter((c) => c.city === "Київ");
  const lvivCinemas = cinemas.filter((c) => c.city === "Львів");
  const odesaCinemas = cinemas.filter((c) => c.city === "Одеса");

  const allCinemaFilms = films.slice(0, 5);
  const multiCityFilms = films.slice(5, 20);
  const kyivFilms = films.slice(20, 25);
  const lvivFilms = films.slice(25, 30);
  const odesaFilms = films.slice(30, 35);
  const singleCinemaFilms = films.slice(35);

  const createList = async (film, cinema) => {

    const sessionList = await sessionListModel.create({
      cinema_id: cinema._id,
      film_id: film._id,
      list: [],
    });

    cinema.lists.push(sessionList._id);
    film.lists.push(sessionList._id);

    await cinema.save();
    await film.save();

    await createSessionsForList(sessionList._id, room);
  };

  for (const film of allCinemaFilms) {
    for (const cinema of cinemas) {
      await createList(film, cinema);
    }
  }

  for (const film of multiCityFilms) {

    const selectedCinemas = [
      randomItem(kyivCinemas),
      randomItem(lvivCinemas),
      randomItem(odesaCinemas),
    ];

    for (const cinema of selectedCinemas) {
      await createList(film, cinema);
    }
  }

  for (const film of kyivFilms) {

    const selected = shuffle(kyivCinemas)
      .slice(0, rand(2, kyivCinemas.length));

    for (const cinema of selected) {
      await createList(film, cinema);
    }
  }

  for (const film of lvivFilms) {

    const selected = shuffle(lvivCinemas)
      .slice(0, rand(2, lvivCinemas.length));

    for (const cinema of selected) {
      await createList(film, cinema);
    }
  }

  for (const film of odesaFilms) {

    const selected = shuffle(odesaCinemas)
      .slice(0, rand(2, odesaCinemas.length));

    for (const cinema of selected) {
      await createList(film, cinema);
    }
  }

  for (const film of singleCinemaFilms) {
    const cinema = randomItem(cinemas);
    await createList(film, cinema);
  }

  return {
    success: true,
    films: films.length,
  };
};

export default generateSessionSeed;