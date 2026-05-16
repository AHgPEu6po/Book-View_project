import fs from "fs";
import path from "path";
import bcrypt from "bcryptjs";
import userModel from "../../models/userModel.js";

const cities = ["Київ", "Львів", "Одеса"]

const districts = {
    "Київ": ["Голосіївський", "Оболонський", "Печерський", "Подільський", "Святошинський", 
        "Солом'янський", "Шевченківський", "Дарницький", "Деснянський", "Дніпровський"],
    "Львів": ["Галицький", "Залізничний", "Личаківський", "Франківський", "Шевченківський", "Сихівський"],
    "Одеса": ["Київський", "Пересипський", "Приморський", "Хаджибейський"]
};

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

const rand = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const USER_CLUSTERS = [
  {
    name: "action",
    genres: ["Бойовик", "Екшн", "Трилер", "Пригоди", "Шпигунський"]
  },
  {
    name: "drama",
    genres: ["Драма", "Мелодрама", "Романтика", "Філософський"]
  },
  {
    name: "horror",
    genres: ["Жахи", "Містика", "Трилер", "Паранормальний"]
  },
  {
    name: "anime",
    genres: ["Аніме", "Фентезі", "Ісекай", "Пригоди"]
  },
  {
    name: "comedy",
    genres: ["Комедія", "Чорна комедія", "Сатира", "Романтична комедія"]
  }
];

const assignCluster = () => {
  return USER_CLUSTERS[rand(0, USER_CLUSTERS.length - 1)];
};

const generateGenres = (cluster) => {
  const favCount = rand(3, 7);

  const shuffled = [...cluster.genres].sort(
    () => 0.5 - Math.random()
  );

  const favoriteGenres = shuffled.slice(0, favCount);

  const excludedGenres = allGenres
    .filter(g => !favoriteGenres.includes(g))
    .slice(0, rand(0, 5));

  return { favoriteGenres, excludedGenres };
};

const generateLocation = (fullProfile) => {
  if (!fullProfile) {
    return { city: null, district: null };
  }

  const fullLocation = Math.random() > 0.33;
  const city = cities[rand(0, cities.length - 1)];
  if (!fullLocation) return { city, district: null };

  const districtList = districts[city];
  const district = districtList[rand(0, districtList.length - 1)];

  return { city, district };
};

const generateBirthYear = (fullProfile) => {
  if (!fullProfile) return null;
  const isBirthYear = Math.random() > 0.33;
  if (!isBirthYear) return null;
  return rand(1950, 2020);
};

const generateRatingCoverage = () => {
  const steps = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];
  return steps[rand(0, steps.length - 1)];
};

const generateUserSeed = async (count = 200) => {

  await userModel.deleteMany();

  const users = [];

  for (let i = 1; i <= count; i++) {

    const fullProfile = Math.random() > 0.25;
    const cluster = assignCluster();

    const password = "12345678";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { favoriteGenres, excludedGenres } = generateGenres(cluster);
    const { city, district } = generateLocation(fullProfile);
    const birthYear = generateBirthYear(fullProfile);

    users.push({
      name: `testUser${i}`,
      email: `testUser${i}@gmail.com`,
      password: hashedPassword,
      birthYear,
      favoriteGenres,
      excludedGenres,
      city,
      district,
      history: [],
    });
  }

  const createdUsers = await userModel.insertMany(users);

  const hiddenData = createdUsers.map((user) => ({
      user_id: user._id,
      ratingCoverage: generateRatingCoverage(),
    }));

  const hiddenDataPath = path.join(process.cwd(), "data", "userHiddenData.json");
  
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
    users: createdUsers,
    hiddenData,
  };
};

export default generateUserSeed;