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
        isPremiere: false
    },
    {
        _id: "e000002",
        name: "Троє",
        image: event2,
        ageRating: "12+",
        category: ["історичний", "пригоди", "екшн"],
        trailerURL: "https://www.youtube.com/watch?v=odQikoUL21I",
        date: 111111111,
        isPremiere: false
    },
    {
        _id: "e000003",
        name: "Ліло і Стіч",
        image: event3,
        ageRating: "3A+",
        category: ["екшн", "пригоди", "комедія", "сімейний"],
        trailerURL: "https://www.youtube.com/watch?v=U6cUTjV2dYA",
        date: 111111111,
        isPremiere: false
    },
    {
        _id: "e000004",
        name: "Смурфи",
        image: event4,
        ageRating: "3A+",
        category: ["анімація", "комедія", "пригоди", "сімейний"],
        trailerURL: "https://www.youtube.com/watch?v=WvuHZwARfi0",
        date: 111111111,
        isPremiere: false
    },
    {
        _id: "e000005",
        name: "Граф Дракула: Історія кохання",
        image: event5,
        ageRating: "16+",
        category: ["жахи", "містика"],
        trailerURL: "https://www.youtube.com/watch?v=P2pA-9_EPnA",
        date: 111111111,
        isPremiere: false
    },
    {
        _id: "e000006",
        name: "Хаген - У долині Нібелунгів",
        image: event6,
        ageRating: "18+",
        category: ["бойовик", "фентезі", "пригоди"],
        trailerURL: "https://www.youtube.com/watch?v=nL6a7cRitC0",
        date: 111111111,
        isPremiere: false
    },
    {
        _id: "p000001",
        name: "2000 метрів до Андріївки",
        image: premiere1,
        ageRating: "16+",
        category: ["документальний"],
        trailerURL: "https://www.youtube.com/watch?v=ge6SGtcdESI",
        date: 111111111,
        isPremiere: true
    },
    {
        _id: "p000002",
        name: "Мисливці за скарбами",
        image: premiere2,
        ageRating: "3A+",
        category: ["пригоди", "комедія", "сімейний"],
        trailerURL: "https://www.youtube.com/watch?v=5K-dsYJtlMs",
        date: 111111111,
        isPremiere: true
    },
    {
        _id: "p000003",
        name: "Роузи",
        image: premiere3,
        ageRating: "16+",
        category: ["комедія", "драма"],
        trailerURL: "https://www.youtube.com/watch?v=L0A-UsxvfUU",
        date: 111111111,
        isPremiere: true
    }
]

export const cinemas = [
    {
        _id: "c000001",
        name: "Boomer",
        image: cinema1,
        address: 'вул. Лаврухіна, 4, ТЦ "РайON"',
        city: "Київ",
        district: "Деснянський",
        cinemaURL: "https://kinoboomer.com.ua/"
    },
    {
        _id: "c000002",
        name: 'Оскар в ТРЦ "Gulliver"',
        image: cinema2,
        address: 'Спортивна площа, 1-А, ТРЦ "Gulliver", 7 поверх',
        city: "Київ",
        district: "Печерський",
        cinemaURL: "https://oskar.kyiv.ua/gulliver"
    },
    {
        _id: "c000003",
        name: 'Оскар в ТРЦ Smart Plaza',
        image: cinema3,
        address: "пр-т Берестейський, 24, ТРЦ Smart Plaza, 3 поверх",
        city: "Київ",
        district: "Шевченківський",
        cinemaURL: "https://oskar.kyiv.ua/smart"
    },
    {
        _id: "c000004",
        name: "Chaplin-Lviv",
        image: cinema4,
        address: "вул. Червоної Калини, 81",
        city: "Львів",
        district: "Сихівський",
        cinemaURL: "https://chaplinlviv.lviv.ua"
    },
    {
        _id: "c000005",
        name: "Lviv Film Center",
        image: cinema5,
        address: "вул. Володимира Великого 18(14-А)",
        city: "Львів",
        district: "Франківський",
        cinemaURL: "https://www.facebook.com/lvivfilmcenter"
    },
    {
        _id: "c000006",
        name: "Горіховий (Lviv Film Center)",
        image: cinema6,
        address: "вул. Володимира Великого, 14а",
        city: "Львів",
        district: "Франківський",
        cinemaURL: "https://lvivfilmcenter.business.site"
    },
    {
        _id: "c000007",
        name: "Сінемапарк",
        image: cinema7,
        address: "вул. Варненська, 4-а",
        city: "Одеса",
        district: "Хаджибейський",
        cinemaURL: "http://www.kinoodessa.com/"
    },
    {
        _id: "c000008",
        name: "Сінема Сіті ТРЦ Fontan Sky Center",
        image: cinema8,
        address: 'пер. Семафорний, 4, ТЦ "Середньофонтанський"',
        city: "Одеса",
        district: "Приморський",
        cinemaURL: "https://multiplex.ua"
    },
    {
        _id: "c000009",
        name: "Планета Кіно (City Center Таїрова)",
        image: cinema9,
        address: "просп. Небесної Сотні, 2",
        city: "Одеса",
        district: "Київський",
        cinemaURL: "https://planetakino.ua"
    },
    {
        _id: "c000010",
        name: "Мультиплекс Riviera",
        image: cinema10,
        address: "Південна дорога, 1, Фонтанка, Одеська область",
        city: "Одеса",
        district: "Пересипський",
        cinemaURL: "https://multiplex.ua"
    }
];

export const cities = ["Київ", "Львів", "Одеса"]

export const districts = {
    "Київ": ["Голосіївський", "Оболонський", "Печерський", "Подільський", "Святошинський", 
        "Солом'янський", "Шевченківський", "Дарницький", "Деснянський", "Дніпровський"],
    "Львів": ["Галицький", "Залізничний", "Личаківський", "Франківський", "Шевченківський", "Сихівський"],
    "Одеса": ["Київський", "Пересипський", "Приморський", "Хаджибейський"]
};
