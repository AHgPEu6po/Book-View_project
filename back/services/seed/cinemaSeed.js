import mongoose from "mongoose";

import cinemaModel from "../../models/cinemaModel.js";

export const cities = ["Київ", "Львів", "Одеса"]

export const districts = {
    "Київ": ["Голосіївський", "Оболонський", "Печерський", "Подільський", "Святошинський", 
        "Солом'янський", "Шевченківський", "Дарницький", "Деснянський", "Дніпровський"],
    "Львів": ["Галицький", "Залізничний", "Личаківський", "Франківський", "Шевченківський", "Сихівський"],
    "Одеса": ["Київський", "Пересипський", "Приморський", "Хаджибейський"]
};

const ROOM_ID = "69fa5652471313b844a99cac";

const IMAGE_URL = "https://res.cloudinary.com/dxkasu7lc/image/upload/v1778743107/lt3ngr0oukp5alx0y6du.png";

const randomStreet = () => {
  return `вул. Безіменна ${
    Math.floor(Math.random() * 200) + 1
  }`;
};

const generateCinemaSeed =
  async () => {

    const cinemas = [];

    for (const city of cities) {

      for ( const district of districts[city] ) {

        const cinemaCount = Math.random() > 0.5 ? 2 : 1;

        for ( let i = 1; i <= cinemaCount; i++ ) {

          cinemas.push({
            name: `Кінотеатр №${i}_${city}_${district}`,
            image: IMAGE_URL,
            address: randomStreet(),
            city,
            district,
            rooms: [ new mongoose.Types.ObjectId(ROOM_ID),
            ],
            cinemaURL: "",
            lists: [],
          });
        }
      }
    }

    const created = await cinemaModel.insertMany(cinemas );

    return created;
};

const removeCinemaSeed = async () => {
    await cinemaModel.deleteMany();
};

export { generateCinemaSeed, removeCinemaSeed };