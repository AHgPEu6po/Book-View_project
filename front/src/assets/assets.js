import logo from "./logo.svg";
import search from './search.svg'
import close from './close.svg'
import menu from './menu.svg'
import hero from './hero.jpg'
import cinema from './cinema.png'
import cinema_man from './cinema_man.png'
import cinema_inside from './cinema_inside.png'
import arrow from './arrow.svg'
import facebook from './facebook.svg'
import instagram from './instagram.svg'
import twitter from './twitter-x.svg'
import youtube from './youtube.svg'

import event1 from './event1.jpg'
import event2 from './event2.jpg'
import event3 from './event3.jpg'
import event4 from './event4.jpg'
import event5 from './event5.jpg'
import event6 from './event6.jpg'
import premiere1 from './premiere1.jpg'
import premiere2 from './premiere2.jpg'
import premiere3 from './premiere3.jpg'

import cinema1 from './cinema1.png'
import cinema2 from './cinema2.png'
import cinema3 from './cinema3.png'
import cinema4 from './cinema4.png'
import cinema5 from './cinema5.png'
import cinema6 from './cinema6.png'
import cinema7 from './cinema7.png'
import cinema8 from './cinema8.png'
import cinema9 from './cinema9.png'
import cinema10 from './cinema10.png'

export const menuLinks = [
    { name: "Кінотеатри", path: "/cinemas"},
    { name: "Афіші", path: "/posters"},
    { name: "Про нас", path: "/about"},
    { name: "Контакти", path: "/contact"}
]

export const assets = {
    logo,
    search,
    close,
    menu,
    hero,
    cinema,
    cinema_man,
    cinema_inside,
    arrow,
    facebook,
    instagram,
    twitter,
    youtube
}

export const films = [
  {
    _id: "e000001",
    name: "Поганці 2",
    image: event1,
    ageRating: "3A+",
    category: ["анімація", "комедія", "пригоди", "сімейний"],
    trailerURL: "https://www.youtube.com/watch?v=qIRoLKsVCh8",
    date: 111111111,
    isPremiere: false,
    lists: ["ls000001","ls000008","ls000014","ls000016"]
  },
  {
    _id: "e000002",
    name: "Троє",
    image: event2,
    ageRating: "12+",
    category: ["історичний", "пригоди", "екшн"],
    trailerURL: "https://www.youtube.com/watch?v=odQikoUL21I",
    date: 111111111,
    isPremiere: false,
    lists: ["ls000003","ls000017"]
  },
  {
    _id: "e000003",
    name: "Ліло і Стіч",
    image: event3,
    ageRating: "3A+",
    category: ["екшн", "пригоди", "комедія", "сімейний"],
    trailerURL: "https://www.youtube.com/watch?v=U6cUTjV2dYA",
    date: 111111111,
    isPremiere: false,
    lists: ["ls000004","ls000010","ls000018"]
  },
  {
    _id: "e000004",
    name: "Смурфи",
    image: event4,
    ageRating: "3A+",
    category: ["анімація", "комедія", "пригоди", "сімейний"],
    trailerURL: "https://www.youtube.com/watch?v=WvuHZwARfi0",
    date: 111111111,
    isPremiere: false,
    lists: ["ls000005","ls000013"]
  },
  {
    _id: "e000005",
    name: "Граф Дракула: Історія кохання",
    image: event5,
    ageRating: "16+",
    category: ["жахи", "містика"],
    trailerURL: "https://www.youtube.com/watch?v=P2pA-9_EPnA",
    date: 111111111,
    isPremiere: false,
    lists: ["ls000006"]
  },
  {
    _id: "e000006",
    name: "Хаген - У долині Нібелунгів",
    image: event6,
    ageRating: "18+",
    category: ["бойовик", "фентезі", "пригоди"],
    trailerURL: "https://www.youtube.com/watch?v=nL6a7cRitC0",
    date: 111111111,
    isPremiere: false,
    lists: ["ls000011"]
  },
  {
    _id: "p000001",
    name: "2000 метрів до Андріївки",
    image: premiere1,
    ageRating: "16+",
    category: ["документальний"],
    trailerURL: "https://www.youtube.com/watch?v=ge6SGtcdESI",
    date: 111111111,
    isPremiere: true,
    lists: ["ls000007"]
  },
  {
    _id: "p000002",
    name: "Мисливці за скарбами",
    image: premiere2,
    ageRating: "3A+",
    category: ["пригоди", "комедія", "сімейний"],
    trailerURL: "https://www.youtube.com/watch?v=5K-dsYJtlMs",
    date: 111111111,
    isPremiere: true,
    lists: ["ls000002","ls000009","ls000015"]
  },
  {
    _id: "p000003",
    name: "Роузи",
    image: premiere3,
    ageRating: "16+",
    category: ["комедія", "драма"],
    trailerURL: "https://www.youtube.com/watch?v=L0A-UsxvfUU",
    date: 111111111,
    isPremiere: true,
    lists: ["ls000012"]
  }
];

export const cinemas = [
  {
    _id: "c000001",
    name: "Boomer",
    image: cinema1,
    address: 'вул. Лаврухіна, 4, ТЦ "РайON"',
    city: "Київ",
    district: "Деснянський",
    cinemaURL: "https://kinoboomer.com.ua/",
    lists: ["ls000001","ls000002","ls000003","ls000004","ls000005","ls000006","ls000007"]
  },
  {
    _id: "c000002",
    name: 'Оскар в ТРЦ "Gulliver"',
    image: cinema2,
    address: 'Спортивна площа, 1-А, ТРЦ "Gulliver", 7 поверх',
    city: "Київ",
    district: "Печерський",
    cinemaURL: "https://oskar.kyiv.ua/gulliver",
    lists: ["ls000008","ls000009","ls000010","ls000011","ls000012","ls000013"]
  },
  {
    _id: "c000003",
    name: 'Оскар в ТРЦ Smart Plaza',
    image: cinema3,
    address: "пр-т Берестейський, 24, ТРЦ Smart Plaza, 3 поверх",
    city: "Київ",
    district: "Шевченківський",
    cinemaURL: "https://oskar.kyiv.ua/smart",
    lists: ["ls000014"]
  },
  {
    _id: "c000004",
    name: "Chaplin-Lviv",
    image: cinema4,
    address: "вул. Червоної Калини, 81",
    city: "Львів",
    district: "Сихівський",
    cinemaURL: "https://chaplinlviv.lviv.ua",
    lists: ["ls000015"]
  },
  {
    _id: "c000005",
    name: "Lviv Film Center",
    image: cinema5,
    address: "вул. Володимира Великого 18(14-А)",
    city: "Львів",
    district: "Франківський",
    cinemaURL: "https://www.facebook.com/lvivfilmcenter",
    lists: ["ls000016"]
  },
  {
    _id: "c000006",
    name: "Горіховий (Lviv Film Center)",
    image: cinema6,
    address: "вул. Володимира Великого, 14а",
    city: "Львів",
    district: "Франківський",
    cinemaURL: "https://lvivfilmcenter.business.site",
    lists: ["ls000017"]
  },
  {
    _id: "c000007",
    name: "Сінемапарк",
    image: cinema7,
    address: "вул. Варненська, 4-а",
    city: "Одеса",
    district: "Хаджибейський",
    cinemaURL: "http://www.kinoodessa.com/",
    lists: ["ls000018"]
  },
  {
    _id: "c000008",
    name: "Сінема Сіті ТРЦ Fontan Sky Center",
    image: cinema8,
    address: 'пер. Семафорний, 4, ТЦ "Середньофонтанський"',
    city: "Одеса",
    district: "Приморський",
    cinemaURL: "https://multiplex.ua",
    lists: []
  },
  {
    _id: "c000009",
    name: "Планета Кіно (City Center Таїрова)",
    image: cinema9,
    address: "просп. Небесної Сотні, 2",
    city: "Одеса",
    district: "Київський",
    cinemaURL: "https://planetakino.ua",
    lists: []
  },
  {
    _id: "c000010",
    name: "Мультиплекс Riviera",
    image: cinema10,
    address: "Південна дорога, 1, Фонтанка, Одеська область",
    city: "Одеса",
    district: "Пересипський",
    cinemaURL: "https://multiplex.ua",
    lists: []
  }
];

export const sessionLists = [
  { _id: "ls000001", cinema_id: "c000001", film_id: "e000001", list: ["s000001","s000002","s000003","s000004","s000005","s000006"] },
  { _id: "ls000002", cinema_id: "c000001", film_id: "p000002", list: ["s000007","s000008","s000009","s000010","s000011"] },
  { _id: "ls000003", cinema_id: "c000001", film_id: "e000002", list: ["s000012","s000013"] },
  { _id: "ls000004", cinema_id: "c000001", film_id: "e000003", list: ["s000014","s000015","s000016"] },

  { _id: "ls000008", cinema_id: "c000002", film_id: "e000001", list: ["s000021","s000022","s000023","s000024","s000025"] },
  { _id: "ls000009", cinema_id: "c000002", film_id: "p000002", list: ["s000026","s000027","s000028","s000029"] },

  { _id: "ls000014", cinema_id: "c000003", film_id: "e000001", list: ["s000036","s000037"] },
  { _id: "ls000015", cinema_id: "c000004", film_id: "p000002", list: ["s000038","s000039"] },
  { _id: "ls000016", cinema_id: "c000005", film_id: "e000001", list: ["s000040"] },

  { _id: "ls000017", cinema_id: "c000006", film_id: "e000002", list: ["s000041"] },
  { _id: "ls000018", cinema_id: "c000007", film_id: "e000003", list: ["s000042"] },
];

export const sessions = [
  { _id: "s000001", list_id: "ls000001", date: "2026-04-07", time: "10:00" },
  { _id: "s000002", list_id: "ls000001", date: "2026-04-07", time: "13:00" },
  { _id: "s000003", list_id: "ls000001", date: "2026-04-07", time: "16:00" },
  { _id: "s000004", list_id: "ls000001", date: "2026-04-08", time: "11:00" },
  { _id: "s000005", list_id: "ls000001", date: "2026-04-08", time: "14:00" },
  { _id: "s000006", list_id: "ls000001", date: "2026-04-08", time: "18:00" },

  { _id: "s000007", list_id: "ls000002", date: "2026-04-07", time: "09:30" },
  { _id: "s000008", list_id: "ls000002", date: "2026-04-07", time: "12:30" },
  { _id: "s000009", list_id: "ls000002", date: "2026-04-07", time: "15:30" },
  { _id: "s000010", list_id: "ls000002", date: "2026-04-08", time: "10:30" },
  { _id: "s000011", list_id: "ls000002", date: "2026-04-08", time: "13:30" },

  { _id: "s000012", list_id: "ls000003", date: "2026-04-07", time: "17:00" },
  { _id: "s000013", list_id: "ls000003", date: "2026-04-08", time: "19:00" },

  { _id: "s000014", list_id: "ls000004", date: "2026-04-07", time: "11:00" },
  { _id: "s000015", list_id: "ls000004", date: "2026-04-08", time: "15:00" },
  { _id: "s000016", list_id: "ls000004", date: "2026-04-08", time: "18:30" },

  { _id: "s000021", list_id: "ls000008", date: "2026-04-07", time: "11:00" },
  { _id: "s000022", list_id: "ls000008", date: "2026-04-07", time: "14:00" },
  { _id: "s000023", list_id: "ls000008", date: "2026-04-07", time: "17:00" },
  { _id: "s000024", list_id: "ls000008", date: "2026-04-08", time: "12:00" },
  { _id: "s000025", list_id: "ls000008", date: "2026-04-08", time: "20:00" },

  { _id: "s000026", list_id: "ls000009", date: "2026-04-07", time: "10:30" },
  { _id: "s000027", list_id: "ls000009", date: "2026-04-07", time: "13:30" },
  { _id: "s000028", list_id: "ls000009", date: "2026-04-08", time: "15:00" },
  { _id: "s000029", list_id: "ls000009", date: "2026-04-08", time: "18:30" },

  { _id: "s000036", list_id: "ls000014", date: "2026-04-07", time: "16:00" },
  { _id: "s000037", list_id: "ls000014", date: "2026-04-08", time: "19:00" },

  { _id: "s000038", list_id: "ls000015", date: "2026-04-07", time: "14:00" },
  { _id: "s000039", list_id: "ls000015", date: "2026-04-08", time: "18:00" },

  { _id: "s000040", list_id: "ls000016", date: "2026-04-07", time: "17:30" },

  { _id: "s000041", list_id: "ls000017", date: "2026-04-07", time: "15:00" },
  { _id: "s000042", list_id: "ls000018", date: "2026-04-08", time: "18:00" },
];

export const allCinemaNames = cinemas.map(c => c.name);

export const allGenres = Array.from(
  new Set(films.flatMap(f => f.category))
).sort((a, b) => a.localeCompare(b, 'uk'));

export const allAgeRatings = ["0+", "3A+", "12+", "16+", "18+"];

export const cities = ["Київ", "Львів", "Одеса"]

export const districts = {
    "Київ": ["Голосіївський", "Оболонський", "Печерський", "Подільський", "Святошинський", 
        "Солом'янський", "Шевченківський", "Дарницький", "Деснянський", "Дніпровський"],
    "Львів": ["Галицький", "Залізничний", "Личаківський", "Франківський", "Шевченківський", "Сихівський"],
    "Одеса": ["Київський", "Пересипський", "Приморський", "Хаджибейський"]
};
