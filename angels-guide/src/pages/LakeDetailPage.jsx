import React, { useState, useMemo, useRef, useEffect } from 'react';
import {Search, Calendar, ChevronDown, MapPin, ArrowRight} from "lucide-react";
import Navbar from "../components/Navbar.jsx";
import { useLocation, useNavigate } from 'react-router-dom';
import bgImgSrc from "../assets/images/background/lake_bg.jpg";

const MOCK_LAKES = [
    {
        id: 1,
        category: 'lake',
        name: "Озеро Светлое",
        specs: { square: "8.5 кв. км", avr_deep: "830 м.", fish: "Карась, щука, карп..."},
        image: '/src/assets/images/mini_lake.jpg',
    },
    {
        id: 2,
        category: 'lake',
        name: "Озеро Глубокое",
        specs: { square: "5.5 кв. км", avr_deep: "1030 м.", fish: "Карась, щука, язь..."},
        image: '/src/assets/images/mini_lake.jpg',
    },
    {
        id: 3,
        category: 'lake',
        name: "Озеро Фантастическое",
        specs: { square: "9 кв. км", avr_deep: "230 м.", fish: "Плотва, карп, язь..."},
        image: '/src/assets/images/mini_lake.jpg',
    },
    {
        id: 4,
        category: 'lake',
        name: "Озеро Перегонное",
        specs: { square: "16 кв. км", avr_deep: "120 м.", fish: "Толстолобик, ёрш, язь..."},
        image: '/src/assets/images/mini_lake.jpg',
    },
    // реки
    {
        id: 101,
        category: 'river',
        name: "Озеро Перегонное",
        specs: { square: "16 кв. км", avr_deep: "120 м.", fish: "Толстолобик, ёрш, язь..."},
        image: '/src/assets/images/mini_lake.jpg',
    },
    // болота
    {
        id: 201,
        category: 'swamp',
        name: "Озеро Перегонное",
        specs: { square: "16 кв. км", avr_deep: "120 м.", fish: "Толстолобик, ёрш, язь..."},
        image: '/src/assets/images/mini_lake.jpg',
    },
    // пруды
    {
        id: 301,
        category: 'pond',
        name: "Озеро Перегонное",
        specs: { square: "16 кв. км", avr_deep: "120 м.", fish: "Толстолобик, ёрш, язь..."},
        image: '/src/assets/images/mini_lake.jpg',
    },
    // карьеры
    {
        id: 401,
        category: 'quarry',
        name: "Озеро Перегонное",
        specs: { square: "16 кв. км", avr_deep: "120 м.", fish: "Толстолобик, ёрш, язь..."},
        image: '/src/assets/images/mini_lake.jpg',
    },
    // платники
    {
        id: 501,
        category: 'payer',
        name: "Озеро Перегонное",
        specs: { square: "16 кв. км", avr_deep: "120 м.", fish: "Толстолобик, ёрш, язь..."},
        image: '/src/assets/images/mini_lake.jpg',
    },

];
const CATEGORIES = [
    { value: 'lake', label: 'Озера'},
    { value: 'river', label: 'Реки'},
    { value: 'swamp', label: 'Болото'},
    { value: 'pond', label: 'Пруд'},
    { value: 'quarry', label: 'Карьер'},
    { value: 'payer', label: 'Платник'},
]
const LakeDetailPage = () => {
    const canvasRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedCategory, setSelectedCategory] = useState(() => {
        return location.state?.category || 'lake';
    });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);

    const filteredWater = useMemo(() => {
        return MOCK_LAKES.filter((water) =>
        water.category === selectedCategory &&
        water.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [selectedCategory, searchQuery]);

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;
        const bg = new Image();
        bg.src = bgImgSrc;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.imageSmoothingEnabled = false;
            if (bg.complete) {

                ctx.drawImage(bg, 0, 0, canvas.width, canvas.height) ;
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


        return (
            <div className="relative h-screen w-full overflow-hidden flex flex-col font-pixel">
                <canvas ref={canvasRef} className="absolute inset-0 -z-10"></canvas>

                <style>{`
                .pixelated { image-rendering: pixelated; }
                
                /* Стилизация инпута даты */
                input[type="date"]::-webkit-calendar-picker-indicator {
                    cursor: pointer;
                    opacity: 0.6;
                    filter: invert(1);
                }

                /* --- КАСТОМНЫЙ СКРОЛЛБАР --- */
                /* Ширина полосы прокрутки */
                .custom-scrollbar::-webkit-scrollbar {
                    width: 16px; 
                }
                /* Фон полосы прокрутки (трек) */
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.4); 
                    border-left: 2px solid #000;
                }
                /* Ползунок (thumb) */
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #eab308; /* yellow-500 */
                    border: 2px solid #000; /* Пиксельная обводка */
                    box-shadow: inset -2px -2px 0px rgba(0,0,0,0.3); /* Эффект объема */
                }
                /* Ползунок при наведении */
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: #facc15; /* yellow-400 */
                }
            `}</style>

                <div className="container mx-auto px-[5.5rem] pt-[1.125rem] flex-shrink-0">
                    <Navbar />
                </div>

                {/* БЛОК ПОИСКА И ФИЛЬТРОВ */}
                {/* Добавил w-full max-w-6xl mx-auto, чтобы он был такой же ширины, как и карточки, и по центру */}
                <div className="flex-shrink-0 px-[5.5rem] mt-6 mb-6">
                    <div className="flex gap-4 items-center justify-between w-full max-w-6xl mx-auto">
                        {/* Поиск */}
                        <div className="relative flex-grow">
                            <input
                                type="text"
                                placeholder="Введите..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-12 bg-[rgba(217,217,217,0.7)] text-lg px-4 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.9)] focus:outline-none placeholder-gray-600"
                            />
                            <Search className="absolute right-3 top-2.5 text-black w-6 h-6"/>
                        </div>

                        {/* Дата */}
                        <div className="relative">
                            <div className="h-12 bg-[rgba(217,217,217,0.7)] border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.9)] flex items-center px-4 gap-2 cursor-pointer group hover:bg-white/80 transition-colors">
                            <span className="text-lg whitespace-nowrap min-w-[140px]">
                                {selectedDate ? selectedDate : "Выбрать День"}
                            </span>
                                <Calendar className="right-5 top-4 w-6 h-6 text-black" />
                                <input
                                    type="date"
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                                />
                            </div>
                        </div>

                        <div className="relative w-72">
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full h-12 appearance-none bg-[rgba(217,217,217,0.7)] text-lg px-4 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.9)] focus:outline-none cursor-pointer hover:bg-white/80 transition-colors"
                            >
                                {CATEGORIES.map(type => (
                                    <option key={type.value} value={type.value}>{type.label}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-3.5 text-black w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                </div>


                <div className="flex-1 min-h-0 overflow-y-auto px-[5.5rem] pb-8 custom-scrollbar">
                    <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto">
                        {filteredWater.map((water) => (
                            <div
                                key={water.id}
                                className="relative bg-[rgba(217,217,217,0.7)] backdrop-blur-sm border-2 border-black p-4 shadow-[6px_6px_0_rgba(0,0,0,0.7)] flex gap-6 hover:border-yellow-600 transition-colors"
                            >
                                <div className="w-64 h-40 flex-shrink-0 border-2 border-black/50 overflow-hidden bg-gray-300">
                                    <img
                                        src={water.image}
                                        alt={water.name}
                                        className="w-full h-full object-cover pixelated hover:scale-110 transition-transform duration-500"
                                        onError={(e) => {e.target.src = 'https://via.placeholder.com/300x200?text=No+Image'}}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="text-3xl mb-3">{water.name}</h3>
                                    <div className="space-y-2 text-lg text-gray-800">
                                        <p><span>Площадь:</span> {water.specs.square}</p>
                                        <p><span>Средняя глубина:</span> {water.specs.avr_deep}</p>
                                        <p className="line-clamp-2"><span>Рыба:</span> {water.specs.fish}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 justify-center w-48">
                                    <button className="bg-yellow-500 hover:bg-yellow-400 text-black text-lg py-3 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] active:shadow-[0_0_0_0] active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                                        <MapPin size={18} />
                                        На карте
                                    </button>
                                    <button
                                        onClick={() => navigate('/info')}
                                        className="bg-yellow-500 hover:bg-yellow-400 text-black text-lg py-3 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,1)] active:shadow-[0_0_0_0] active:translate-x-1 active:translate-y-1 transition-all flex items-center justify-center gap-2">
                                        Подробнее
                                        <ArrowRight size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredWater.length === 0 && (
                            <div className="text-center text-white text-2xl mt-10 drop-shadow-md">
                                Водоемы по вашему запросу не найдены...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

export default LakeDetailPage;