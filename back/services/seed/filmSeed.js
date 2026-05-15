import fs from "fs";
import path from "path";
import filmModel from "../../models/filmModel.js";

const IMAGE_URL = "https://res.cloudinary.com/dxkasu7lc/image/upload/v1778742911/cqhmkqpjkop8je3ktz3l.png";

export const allAgeRatings = ["3A+", "12+", "16+", "18+"];

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
  "Магія",
  "Мафія",
  "Медичний",
  "Мелодрама",
  "Містика",
  "Молодіжний",
  "Монстр-муві",
  "Музичний",
  "Мюзикл",
  "Надприродний",
  "Наукова фантастика",
  "Неонуар",
  "Нуар",
  "Пародія",
  "Паранормальний",
  "Піратський",
  "Подорож у часі",
  "Поліцейський",
  "Постапокаліпсис",
  "Пригоди",
  "Психологічний",
  "Психотрилер",
  "Романтика",
  "Романтична комедія",
  "Самурайський",
  "Саспенс",
  "Сатира",
  "Середньовічний",
  "Сімейний",
  "Соціальний",
  "Спорт",
  "Стіпанк",
  "Супергеройський",
  "Трилер",
  "Фантастика",
  "Фентезі",
  "Філософський",
  "Хакерський",
  "Чорна комедія",
  "Шпигунський",
];

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomGenres = () => {
  const genresCount = Math.floor(Math.random() * 5) + 1;
  const shuffled = [...allGenres].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, genresCount);
};

const getRandomPopularity = () => {
  return Math.floor(Math.random() * (80 - 20 + 1)) + 20;
};

const getRandomRating = () => {
  const random = Math.pow(Math.random(), 0.7);
  const skewed = 1 - Math.pow(random, 2);
  const rating = 3 + skewed * (10 - 3);
  return Number(rating.toFixed(1));
};

const generateFilmSeed = async ( count = 500 ) => {

  const films = [];

  for (let i = 1; i <= count; i++) {

    films.push({

      name: `Фільм №${i}`,
      image: IMAGE_URL,
      ageRating: getRandomElement(allAgeRatings),
      category: getRandomGenres(),
      trailerURL: "",
      isPremiere: false,
      lists: [],
    });
  }

  const createdFilms = await filmModel.insertMany(films);

  const hiddenData = createdFilms.map((film) => ({
      film_id: film._id,
      popularity: getRandomPopularity(),
      rating: getRandomRating(),
    }));

  const hiddenDataPath = path.join(process.cwd(), "data", "filmHiddenData.json");

  fs.mkdirSync(
    path.dirname(hiddenDataPath),
    { recursive: true }
  );

  fs.writeFileSync(
    hiddenDataPath,
    JSON.stringify(
      hiddenData,
      null,
      2
    )
  );

  return {
    films: createdFilms,
    hiddenData,
  };
};

const removeFilmSeed =
  async () => {

    await filmModel.deleteMany();

    const hiddenDataPath =
      path.join(
        process.cwd(),
        "data",
        "filmHiddenData.json"
      );

    if (
      fs.existsSync(hiddenDataPath)
    ) {
      fs.unlinkSync(hiddenDataPath);
    }
};

export { generateFilmSeed, removeFilmSeed };