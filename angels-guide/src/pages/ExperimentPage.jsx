import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar.jsx";
import {
    ArrowLeft, MapPin, Droplets, Wind, Thermometer,
    Activity, Fish, Anchor, Navigation, ShieldCheck,
    Sword, Leaf, Crown, Calendar
} from 'lucide-react';


import bgImageSrc from '/src/assets/images/background/lake_bg.jpg';
import fishIcon from '../assets/images/fish.jpg'; // Заглушка

const LAKE_DATA = {
    id: 1,
    name: "Озеро Светлое",
    description: "\v    Живописное лесное озеро с кристально чистой водой. Идеально для ловли на спиннинг с лодки.\n \vЭто место славится как зона платной рыбалки, предоставляя оборудованные места на берегу, мостки и возможность аренды лодок. Ловля там требует умения, но позволяет поймать трофейные экземпляры.",
    coordinates: [55.123, 37.456],

    // ПАСПОРТ
    passport: {
        bottom: "Илистое, местами песок",
        clarity: "Высокая (до 2м)",
        flow: "Отсутствует",
        vegetation: "Кувшинки вдоль берега (20%)",
        depth: "Средняя 3м, Ямы до 12м"
    },

    // БЕСТИАРИЙ
    fish: [
        {
            name: "Щука",
            type: "predator", // хищник
            isRare: false,
            activity: 85,
            icon: fishIcon
        },
        {
            name: "Окунь",
            type: "predator",
            isRare: false,
            activity: 60,
            icon: fishIcon
        },
        {
            name: "Карась",
            type: "peaceful", // мирная
            isRare: false,
            activity: 30,
            icon: fishIcon
        },
        {
            name: "Карп",
            type: "peaceful",
            isRare: false,
            activity: 50,
            icon: fishIcon
        },
        {
            name: "Линь",
            type: "peaceful",
            isRare: true, // редкая/трофейная
            activity: 10,
            icon: fishIcon
        },
        {
            name: "Судак",
            type: "predator",
            isRare: true,
            activity: 40,
            icon: fishIcon
        },
    ],

    // ТАКТИКА
    tactics: {
        gear: ["Спиннинг Light (3-12г)", "Поплавок (Мах 5м)"],
        baits: ["Вертушка Mepps #2", "Воблер Minnow 70mm", "Червь"],
        bestTime: "Раннее утро (4:00 - 8:00)",
        difficulty: 3 // из 5
    },

    // ЛОГИСТИКА
    logistics: {
        access: "Грунтовка (Проезд на легковой в сухую погоду)",
        facilities: ["Парковка (дикая)", "Места под палатку"],
        boat: "Разрешено (Без мотора)",
        price: "Бесплатно"
    }
};

const LakeInfoPage = () => {
    const { id } = useParams(); // Получаем ID из URL
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    // --- СОСТОЯНИЕ ПОГОДЫ (API) ---
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('all');
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const filteredFish = LAKE_DATA.fish.filter(fish => {
        if (activeTab === 'all') return true;
        if (activeTab === 'rare') return fish.isRare;
        return fish.type === activeTab;
    });


    useEffect(() => {
        // Здесь будет реальный fetch, например к OpenWeatherMap
        const fetchWeather = async () => {
            setLoading(true);
            // Имитируем задержку сети
            setTimeout(() => {
                setWeather({
                    temp: 18,
                    waterTemp: 16,
                    pressure: 745,
                    condition: "Облачно",
                    wind: 3.5, // м/с
                    biteChance: 75 // Рассчитанный шанс клёва
                });
                setLoading(false);
            }, 1000);
        };
        fetchWeather();
    }, [id]);

    // --- АНИМАЦИЯ ФОНА ---
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;
        const bg = new Image();
        bg.src = bgImageSrc;
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.imageSmoothingEnabled = false;
            if (bg.complete) {

                ctx.globalAlpha = 1;
                ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);


                ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            animationId = requestAnimationFrame(animate);
        };
        window.addEventListener('resize', resize);
        resize();
        bg.onload = () => animate();
        if (bg.complete) animate();
        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
        };
    }, []);


    const renderStars = (count) => {
        return Array(5).fill(0).map((_, i) => (
            <span key={i} className={`text-2xl ${i < count ? 'text-yellow-400' : 'text-gray-600'}`}>★</span>
        ));
    };

    return (
        <div className="relative h-screen w-full flex flex-col font-pixel text-black">
            <canvas ref={canvasRef} className="absolute inset-0 -z-10 fixed" />

            <style>{`
                .pixelated { image-rendering: pixelated;  }
                .custom-scrollbar::-webkit-scrollbar { width: 16px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0, 0, 0, 0.6); border-left: 2px solid #000; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #eab308; border: 2px solid #000; box-shadow: inset -2px -2px 0px rgba(0,0,0,0.3); }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #facc15; }
            `}</style>

            {/* ШАПКА */}
            <div className="container mx-auto px-[5.5rem] pt-[1.125rem] flex-shrink-0">
                <Navbar />
            </div>

            {/* КНОПКА НАЗАД */}
            <div className="relative flex py-4 items-center justify-center w-full ">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-[5.5rem] flex items-center gap-2 text-white hover:text-yellow-400 transition-colors drop-shadow-md text-lg"
                >
                    <ArrowLeft size={24} /> Назад к списку
                </button>
                <div className="relative flex justify-center">
                    <div className="h-12 bg-[rgba(217,217,217,0.7)] border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.9)] flex items-center px-4 gap-2 cursor-pointer group hover:bg-white/80 transition-colors">
                            <span className="relative pr-8 text-lg whitespace-nowrap min-w-[140px]">
                                {selectedDate ? selectedDate : "Выбрать День"}
                            </span>
                        <Calendar className="absolute right-3 top-2 w-6 h-6 text-black" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                        />
                    </div>
                </div>
            </div>


            {/* ГЛАВНЫЙ КОНТЕНТ */}
            <div className="flex-1 px-[5.5rem] pb-10 w-full max-w-7xl mx-auto overflow-y-auto overflow-x-hidden custom-scrollbar">

                {/* 1. ЗАГОЛОВОК И ПОГОДА (ВЕРХНИЙ БЛОК) */}
                <div className="bg-[#EAD4AA]/80 border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,0.5)] px-4 mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl text-[#FFFFB7] drop-shadow-[3px_3px_0_rgba(0,0,0,0.8)] pt-10 pb-2 tracking-wide">{LAKE_DATA.name}</h1>
                        <p className="mt-4 text-lg text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)] pb-6 max-w-2xl whitespace-pre-line">{LAKE_DATA.description}</p>
                    </div>

                    {/* Блок Погоды (API) */}
                    <div className="bg-[#EAD4AA] px-14 border-4 pt-6 mt-4 border-black min-w-[250px]">
                        <h3 className="text-4xl text-[#FFFFB7] drop-shadow-[3px_3px_0_rgba(0,0,0,0.8)] border-b-2 border-[#FFFFB7] pb-2 mb-3 text-center">
                            Прогноз
                        </h3>
                        {loading ? (
                            <div className="text-center animate-pulse">Загрузка данных...</div>
                        ) : (
                            <div className="space-y-4 text-lg">
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2"><Thermometer size={18}/> Воздух:</span>
                                    <span className="">+{weather.temp}°C</span>
                                </div>
                                <div className="flex justify-between items-center text-black">
                                    <span className="flex items-center gap-2"><Droplets size={18}/> Вода:</span>
                                    <span className="">+{weather.waterTemp}°C</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2"><Wind size={18}/> Ветер:</span>
                                    <span>{weather.wind} м/с</span>
                                </div>
                                <div className="mt-3 border-t-2 border-[#FFFFB7] text-center">
                                    <span className="block py-4 text-sm">Шанс клёва:</span>
                                    <span className="text-2xl  text-green-700">{weather.biteChance}%</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* 2. ЛЕВАЯ КОЛОНКА: ПАСПОРТ И ЛОГИСТИКА */}
                    <div className="space-y-8">
                        {/* ПАСПОРТ ВОДОЕМА */}
                        <div className="bg-[#EAD4AA]/80 border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,1)] p-6">
                            <h2 className="relative mb-4 text-2xl text-center items-center text-[#FFFFB7] drop-shadow-[2px_2px_0_rgba(0,0,0,1)] border-b-4 border-black pb-2  -mx-6 px-6 -mt-6 pt-4">
                                <Anchor className="absolute" size={24} /> Паспорт водоема
                            </h2>
                            <ul className="space-y-3 text-lg">
                                <li className="flex justify-between border-b-2 border-[#FFFFB7] pb-1 drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
                                    <span className="text-white">Тип дна:</span>
                                    <span className="text-base text-white text-right">{LAKE_DATA.passport.bottom}</span>
                                </li>
                                <li className="flex justify-between border-b-2 text-white border-[#FFFFB7] pb-1 drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
                                    <span>Прозрачность:</span>
                                    <span className="text-base text-right">{LAKE_DATA.passport.clarity}</span>
                                </li>
                                <li className="flex justify-between border-b-2 border-[#FFFFB7] pb-1 text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
                                    <span>Течение:</span>
                                    <span className="text-base text-right">{LAKE_DATA.passport.flow}</span>
                                </li>
                                <li className="flex justify-between border-b-2 border-[#FFFFB7] pb-1 text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
                                    <span>Глубины:</span>
                                    <span className="text-base text-right">{LAKE_DATA.passport.depth}</span>
                                </li>
                                <li className="flex justify-between text-white drop-shadow-[1px_1px_0_rgba(0,0,0,0.8)]">
                                    <span>Растительность:</span>
                                    <span className="text-base text-right max-w-[50%]">{LAKE_DATA.passport.vegetation}</span>
                                </li>
                            </ul>
                        </div>

                        {/* ИНФРАСТРУКТУРА */}
                        <div className="bg-[#EAD4AA]/80 border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,1)] p-6">
                            <h2 className="relative mb-4 text-2xl text-center items-center text-[#FFFFB7] drop-shadow-[2px_2px_0_rgba(0,0,0,1)] border-b-4 border-black pb-2 -mx-6 px-6 -mt-6 pt-4">
                                <Navigation className="absolute" size={24} /> Логистика
                            </h2>
                            <div className="space-y-4 text-lg">
                                <div>
                                    <span className=" block mb-1">Подъезд:</span>
                                    <p className="bg-white/50 p-2 border border-black/20">{LAKE_DATA.logistics.access}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className=" block mb-1">Лодка:</span>
                                        <p>{LAKE_DATA.logistics.boat}</p>
                                    </div>
                                    <div>
                                        <span className=" block mb-1">Цена:</span>
                                        <p className="text-green-800 ">{LAKE_DATA.logistics.price}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className=" block mb-1">Удобства:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {LAKE_DATA.logistics.facilities.map((fac, i) => (
                                            <span key={i} className="bg-[#D4C095] px-2 py-1 border border-black text-sm rounded-none shadow-[2px_2px_0_black]">
                                                {fac}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. ПРАВАЯ КОЛОНКА: БЕСТИАРИЙ И ТАКТИКА */}
                    <div className="space-y-8">

                        <div className="bg-[#EAD4AA]/80 border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,1)] p-6 min-h-[400px] flex flex-col">

                            {/* Заголовок */}
                            <h2 className="relative mb-4 text-2xl text-center items-center text-[#FFFFB7] drop-shadow-[2px_2px_0_rgba(0,0,0,1)] border-b-4 border-black pb-2 -mx-6 px-6 -mt-6 pt-4">
                                <Fish className="absolute" size={24} /> Бестиарий
                            </h2>

                            {/* КНОПКИ-ФИЛЬТРЫ (ТАБЫ) */}
                            <div className="flex gap-2 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                                <button
                                    onClick={() => setActiveTab('all')}
                                    className={`px-3 py-2 border-2 border-black flex items-center gap-2 transition-all ${
                                        activeTab === 'all'
                                            ? 'bg-yellow-500 shadow-[inset_2px_2px_0_rgba(0,0,0,0.2)] translate-y-1'
                                            : 'bg-white shadow-[4px_4px_0_black] hover:-translate-y-0.5'
                                    }`}
                                >
                                    <Fish size={16} /> Все
                                </button>
                                <button
                                    onClick={() => setActiveTab('predator')}
                                    className={`px-3 py-2 border-2 border-black flex items-center gap-2 transition-all ${
                                        activeTab === 'predator'
                                            ? 'bg-red-400 shadow-[inset_2px_2px_0_rgba(0,0,0,0.2)] translate-y-1'
                                            : 'bg-white shadow-[4px_4px_0_black] hover:-translate-y-0.5'
                                    }`}
                                >
                                    <Sword size={16} /> Хищник
                                </button>
                                <button
                                    onClick={() => setActiveTab('peaceful')}
                                    className={`px-3 py-2 border-2 border-black flex items-center gap-2 transition-all ${
                                        activeTab === 'peaceful'
                                            ? 'bg-green-400 shadow-[inset_2px_2px_0_rgba(0,0,0,0.2)] translate-y-1'
                                            : 'bg-white shadow-[4px_4px_0_black] hover:-translate-y-0.5'
                                    }`}
                                >
                                    <Leaf size={16} /> Мирная
                                </button>
                                <button
                                    onClick={() => setActiveTab('rare')}
                                    className={`px-3 py-2 border-2 border-black flex items-center gap-2 transition-all ${
                                        activeTab === 'rare'
                                            ? 'bg-purple-400 shadow-[inset_2px_2px_0_rgba(0,0,0,0.2)] translate-y-1'
                                            : 'bg-white shadow-[4px_4px_0_black] hover:-translate-y-0.5'
                                    }`}
                                >
                                    <Crown size={16} /> Редкие
                                </button>
                            </div>

                    {/* СПИСОК РЫБ */}
                    <div className="space-y-3 flex-1">
                        {filteredFish.length > 0 ? (
                            filteredFish.map((fish, idx) => (
                                <div key={idx} className="flex items-center gap-4 bg-white/50 p-2 border border-black/10 hover:bg-white hover:border-black transition-colors cursor-help group">
                                    {/* Иконка */}
                                    <div className="w-12 h-12 bg-white border-2 border-black flex-shrink-0 relative">
                                        <img src={fish.icon} alt={fish.name} className="w-full h-full object-cover pixelated" />
                                        {/* Мини-иконка типа в углу */}
                                        <div className="absolute -bottom-1 -right-1 bg-white border border-black p-0.5">
                                            {fish.type === 'predator' ? <Sword size={10} className="text-red-600"/> : <Leaf size={10} className="text-green-600"/>}
                                        </div>
                                    </div>

                                    {/* Инфо */}
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1 items-center">
                                            <span className="font-bold text-lg">{fish.name}</span>
                                            {fish.isRare && (
                                                <span className="text-[10px] uppercase font-bold text-purple-700 border border-purple-700 px-1 bg-purple-100">
                                                            Rare
                                                        </span>
                                            )}
                                        </div>
                                        {/* Прогресс бар активности */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-3 bg-gray-300 border border-black relative">
                                                <div
                                                    className={`h-full ${
                                                        fish.activity > 70 ? 'bg-green-500' :
                                                            fish.activity > 40 ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}
                                                    style={{ width: `${fish.activity}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold w-8 text-right">{fish.activity}%</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 text-gray-500 italic">
                                В этой категории пока никого нет...
                            </div>
                        )}
                    </div>
                </div>

                        {/* ТАКТИКА И ГАЙД */}
                        <div className="bg-[#EAD4AA]/80 border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,1)] p-6">
                            <h2 className="relative mb-4 text-2xl text-center items-center text-[#FFFFB7] drop-shadow-[2px_2px_0_rgba(0,0,0,1)] border-b-4 border-black pb-2 -mx-6 px-6 -mt-6 pt-4">
                                <Activity className="absolute" size={24} /> Тактика ловли
                            </h2>

                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="">Сложность:</span>
                                    <div className="flex gap-1">{renderStars(LAKE_DATA.tactics.difficulty)}</div>
                                </div>
                                <div className="flex justify-between items-baseline">
                                    <span className="">Лучшее время:</span>
                                    <span className="text-black-400 px-2 font-pixel text-sm">
                                        {LAKE_DATA.tactics.bestTime}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <span className=" block text-sm text-gray-600 uppercase">Рекомендуемые снасти:</span>
                                    <ul className="list-disc list-inside pl-1">
                                        {LAKE_DATA.tactics.gear.map((g, i) => (
                                            <li key={i} className="text-lg">{g}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <span className=" block text-sm text-gray-600 uppercase">Топ приманки:</span>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        {LAKE_DATA.tactics.baits.map((bait, i) => (
                                            <span key={i} className="bg-white border-2 border-black px-2 py-1 shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
                                                {bait}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default LakeInfoPage;