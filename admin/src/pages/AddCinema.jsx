import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const AddCinema = ({ token }) => {

  const cities = ["Київ", "Львів", "Одеса"]

  const districts = {
    "Київ": ["Голосіївський", "Оболонський", "Печерський", "Подільський", "Святошинський", 
        "Солом'янський", "Шевченківський", "Дарницький", "Деснянський", "Дніпровський"],
    "Львів": ["Галицький", "Залізничний", "Личаківський", "Франківський", "Шевченківський", "Сихівський"],
    "Одеса": ["Київський", "Пересипський", "Приморський", "Хаджибейський"]
  };

  const [image, setImage] = useState(false);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState(cities[0]);
  const [district, setDistrict] = useState("");
  const [cinemaURL, setCinemaURL] = useState("");

  useEffect(() => {
    if (city) {
      setDistrict(districts[city][0]);
    }
  }, [city]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("address", address);
      formData.append("city", city);
      formData.append("district", district);
      formData.append("cinemaURL", cinemaURL);

      if (image) {
        formData.append("image", image);
      }

      const res = await axios.post(
        backendUrl + "/api/cinema/create",
        formData,
        { headers: { token } }
      );

      if (res.data.success) {
        toast.success("Кінотеатр додано");

        setName("");
        setAddress("");
        setCinemaURL("");
        setImage(false);
        setCity(cities[0]);
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col w-full items-start gap-3"
    >
      <div>
        <p className="mb-2">Зображення кінотеатру</p>

        <label htmlFor="image">
            <img
                className="w-32 cursor-pointer"
                src={
                    !image
                        ? assets.upload_area
                        : URL.createObjectURL(image)
                }
                alt=""
            />

            <input
                onChange={(e) => setImage(e.target.files[0])}
                type="file"
                id="image"
                hidden
            />
        </label>
    </div>

      <div className="w-full">
        <p>Назва</p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Назва кінотеатру"
          required
        />
      </div>

      <div className="w-full">
        <p>Адреса</p>
        <input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="Вулиця, будинок"
          required
        />
      </div>

      <div className="flex gap-6">
        <div>
          <p>Місто</p>
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="px-3 py-2"
          >
            {cities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p>Район</p>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="px-3 py-2"
          >
            {city &&
              districts[city].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
          </select>
        </div>
      </div>

      <div className="w-full">
        <p>Посилання (опціонально)</p>
        <input
          value={cinemaURL}
          onChange={(e) => setCinemaURL(e.target.value)}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder="https://..."
        />
      </div>

      <button
        type="submit"
        className="w-48 py-2 mt-4 bg-black text-white rounded"
      >
        Додати кінотеатр
      </button>
    </form>
  );
};

export default AddCinema;