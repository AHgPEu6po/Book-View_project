import React, { useState } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";
import { backendUrl } from "../App";
import { assets } from "../assets/assets";

const AddFilm = ({ token }) => {

    const [image, setImage] = useState(false);

    const [name, setName] = useState("");
    const [ageRating, setAgeRating] = useState("16+");
    const [trailerURL, setTrailerURL] = useState("");
    const [isPremiere, setIsPremiere] = useState(false);

    const [genres, setGenres] = useState([]);

    const allGenres = [
        "Анімація",
        "Аніме",
        "Апокаліпсис",
        "Артхаус",
        "Біографія",
        "Бойовик",
        "Бойові мистецтва",
        "Воєнний",
        "Вампіри",
        "Вестерн",
        "Виживання",
        "Гангстерський",
        "Готичний",
        "Детектив",
        "Документальний",
        "Дорожній",
        "Драма",
        "Екологічний",
        "Експериментальний",
        "Екшн",
        "Еротика",
        "Жахи",
        "Зомбі",
        "Ісекай",
        "Історичний",
        "Казка",
        "Катастрофа",
        "Кіберпанк",
        "Комедія",
        "Комедія жахів",
        "Концертний",
        "Короткометражний",
        "Космічний",
        "Кримінал",
        "Кулінарний",
        "Лялькова анімація",
        "Магія",
        "Мафія",
        "Медичний",
        "Мелодрама",
        "Меланхолійний",
        "Містика",
        "Міфологічний",
        "Молодіжний",
        "Монстр-муві",
        "Музичний",
        "Мультфільм",
        "Мюзикл",
        "Надприродний",
        "Наукова фантастика",
        "Неонуар",
        "Незалежне кіно",
        "Німе кіно",
        "Нуар",
        "Пародія",
        "Паранормальний",
        "Піратський",
        "Повнометражний",
        "Повсякденність",
        "Подорож у часі",
        "Поліцейський",
        "Політичний",
        "Постапокаліпсис",
        "Пригоди",
        "Психоделічний",
        "Психологічний",
        "Психологічний трилер",
        "Психотрилер",
        "Реаліті",
        "Релігійний",
        "Ретро",
        "Різдвяний",
        "Романтика",
        "Романтична комедія",
        "Самурайський",
        "Саспенс",
        "Сатира",
        "Святковий",
        "Середньовічний",
        "Сімейний",
        "Соціальний",
        "Спорт",
        "Стіпанк",
        "Судовий",
        "Супергеройський",
        "Танцювальний",
        "Твір дорослішання",
        "Технотрилер",
        "Трагікомедія",
        "Трилер",
        "Тюремний",
        "Фантастика",
        "Фентезі",
        "Філософський",
        "Хакерський",
        "Чорна комедія",
        "Шпигунський",
        "Юридичний"
    ];

    const customSelectStyles = {
        control: (provided, state) => ({
            ...provided,
            minHeight: "44px",
            borderRadius: "6px",
            borderColor: state.isFocused ? "#000" : "#d1d5db",
            boxShadow: "none",
            "&:hover": {
                borderColor: "#000"
            }
        }),

        multiValue: (provided) => ({
            ...provided,
            backgroundColor: "#000",
            color: "#fff"
        }),

        multiValueLabel: (provided) => ({
            ...provided,
            color: "#fff"
        }),

        multiValueRemove: (provided) => ({
            ...provided,
            color: "#fff",
            ":hover": {
                backgroundColor: "#222",
                color: "#fff"
            }
        })
    };

    const onSubmitHandler = async (e) => {
        e.preventDefault();

        try {

            if (!image) {
                return toast.error("Завантажте постер фільму");
            }

            if (genres.length === 0) {
                return toast.error("Оберіть хоча б один жанр");
            }

            const formData = new FormData();

            formData.append("name", name);
            formData.append("image", image);
            formData.append("ageRating", ageRating);
            formData.append("trailerURL", trailerURL);
            formData.append("isPremiere", isPremiere);

            genres.forEach((genre) => {
                formData.append("category", genre.value);
            });

            const response = await axios.post(
                backendUrl + "/api/film/create",
                formData,
                {
                    headers: { token }
                }
            );

            if (response.data.success) {

                toast.success("Фільм успішно додано");

                setName("");
                setImage(false);
                setAgeRating("16+");
                setTrailerURL("");
                setGenres([]);
                setIsPremiere(false);

            } else {
                toast.error(response.data.message);
            }

        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    return (
        <form
            onSubmit={onSubmitHandler}
            className="flex flex-col w-full items-start gap-5"
        >

            <div>
                <p className="mb-2">Постер фільму</p>

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
                <p className="mb-2">Назва фільму</p>

                <input
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    className="w-full max-w-[500px] px-3 py-2 border rounded"
                    type="text"
                    placeholder="Введіть назву фільму"
                    required
                />
            </div>

            <div>
                <p className="mb-2">Віковий рейтинг</p>

                <select
                    onChange={(e) => setAgeRating(e.target.value)}
                    value={ageRating}
                    className="px-3 py-2 border rounded"
                >
                    <option value="0+">0+</option>
                    <option value="3A+">3A+</option>
                    <option value="12+">12+</option>
                    <option value="16+">16+</option>
                    <option value="18+">18+</option>
                </select>
            </div>

            <div className="w-full max-w-[500px]">
                <p className="mb-2">Жанри</p>

                <Select
                    isMulti
                    options={allGenres.map((g) => ({
                        value: g,
                        label: g
                    }))}
                    value={genres}
                    onChange={setGenres}
                    placeholder="Оберіть жанри"
                    styles={customSelectStyles}
                />
            </div>

            <div className="w-full">
                <p className="mb-2">Посилання на трейлер</p>

                <input
                    onChange={(e) => setTrailerURL(e.target.value)}
                    value={trailerURL}
                    className="w-full max-w-[500px] px-3 py-2 border rounded"
                    type="text"
                    placeholder="https://youtube.com/..."
                />
            </div>

            <div className="flex gap-2 items-center">
                <input
                    type="checkbox"
                    id="premiere"
                    className="accent-black"
                    checked={isPremiere}
                    onChange={() => setIsPremiere(prev => !prev)}
                />

                <label
                    htmlFor="premiere"
                    className="cursor-pointer"
                >
                    Позначити як премʼєру
                </label>
            </div>

            <button
                type="submit"
                className="w-48 py-3 mt-4 bg-black text-white rounded"
            >
                Додати фільм
            </button>

        </form>
    );
};

export default AddFilm;