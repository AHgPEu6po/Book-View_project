import logo from "./logo.svg";
import search from './search.svg'
import close from './close.svg'
import menu from './menu.svg'
import hero from './hero.jpg'
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