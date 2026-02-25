import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown } from 'lucide-react';
import Navbar from "../components/Navbar.jsx";

// ИМПОРТЫ
import bgImageSrc from '../assets/images/background/blue_bg.jpg';
import grandpaBase from '../assets/images/dedus.png';

const MOCK_PRODUCTS = [
    {
        id: 1,
        category: 'rods',
        name: 'Shimano Catana 210M',
        specs: { length: '2.10 м', test: '7-28г'},
        price: 4500,
        image: '/src/assets/images/spin1.png',
        color: 'red',
        previewImage: '/src/assets/images/spin_noo.png'
    },
    {
        id: 2,
        category: 'rods',
        name: 'Daiwa Ninja X',
        specs: { length: '2.40 м', test: '10-30г' },
        price: 5200,
        image: '/src/assets/images/spinning/result_spin2.png',
        previewImage: '/src/assets/images/head_1.png',
        color: 'blue'
    },
    {
        id: 3,
        category: 'rods',
        name: 'Crazy Fish Arion',
        specs: { length: '2.10 м', test: '3-12г' },
        price: 12000,
        image: '/src/assets/images/spin1.png',
        previewImage: '/src/assets/images/spinning/green-spin.png',
        color: 'black'
    },
    {
        id: 4,
        category: 'rods',
        name: 'Zetrix Avalanche',
        specs: { length: '2.20 м', test: '5-25г' },
        price: 8900,
        image: '/src/assets/images/spin1.png',
        previewImage: '/src/assets/images/spinning/red_spin.png',
        color: 'red'
    },
    // куртки
    {
        id: 101,
        category: 'jackets',
        name: 'Куртка "Лесник"',
        specs: { material: 'Брезент', season: 'Осень' },
        price: 3500,
        image: '/src/assets/images/spin1.png',
        previewImage: '/src/assets/images/clothe_of_fisherman/green_jacket.png', // Одежда на деда
    },
    {
        id: 102,
        category: 'jackets',
        name: 'Дождевик Рыбака',
        specs: { material: 'ПВХ', season: 'Лето' },
        price: 1500,
        image: '/src/assets/images/spin1.png',
        previewImage: '/src/assets/images/clothe_of_fisherman/tulup1.png',
    },
    {
        id: 103,
        category: 'jackets',
        name: 'Джинсовка Рыбака',
        specs: { material: 'Кожа', season: 'ОСень' },
        price: 3600,
        image: '/src/assets/images/spin1.png',
        previewImage: '/src/assets/images/clothe_of_fisherman/brown_jacket1.png',
    },
    {
        id: 104,
        category: 'jackets',
        name: 'Джинсовка Рыбака',
        specs: { material: 'Кожа', season: 'ОСень' },
        price: 3600,
        image: '/src/assets/images/spin1.png',
        previewImage: '/src/assets/images/clothe_of_fisherman/black_jacket1.png',
    },
    {
        id: 105,
        category: 'jackets',
        name: 'Дождевик Рыбака',
        specs: { material: 'Кожа', season: 'Лето' },
        price: 4200,
        image: '/src/assets/images/spin1.png',
        previewImage: '/src/assets/images/clothe_of_fisherman/white_jacket.png',
    },
    //штаны
    {
        id: 201,
        category: 'pants',
        name: 'Бродни болотные',
        specs: { material: 'Резина', type: 'Высокие' },
        price: 2800,
        image: '/src/assets/images/spin1.png',
        previewImage: '/src/assets/images/clothe_of_fisherman/green_pants1.png',
    },
    {
        id: 202,
        category: 'pants',
        name: 'Бродни коричневые',
        specs: { material: 'Резина', type: 'Высокие' },
        price: 3800,
        image: '/src/assets/images/spin1.png',
        previewImage: '/src/assets/images/clothe_of_fisherman/brown_pants1.png',
    },
    // сапоги
    {
        id: 301,
        category: 'boots',
        name: 'Галоши',
        specs: { material: 'Резина', locality: 'Болотистая'},
        price: 1300,
        image: '/src/assets/images/spin1.png',
        previewImage: '/src/assets/images/clothe_of_fisherman/green_boots.png',
    },
    {
        id: 302,
        category: 'boots',
        name: 'Галоши',
        specs: { material: 'Резина', locality: 'Болотистая'},
        price: 1300,
        image: '/src/assets/images/spin1.png',
        previewImage: '/src/assets/images/clothe_of_fisherman/brown_boots1.png',
    },
    {
        id: 401,
        category: 'head',
        name: 'Шапка ушанка',
        specs: { material: 'Мех', season: 'Зима'},
        price: 2100,
        image: '/src/assets/images/head_1.png',
        previewImage: '/src/assets/images/head_1.png',
    }
];

const CATEGORIES = [
    { value: 'rods', label: 'Удочка' },
    { value: 'jackets', label: 'Куртка' },
    { value: 'pants', label: 'Штаны' },
    { value: 'boots', label: 'Обувь' },
    { value: 'head', label: 'Шапка'}
];

const EquipmentPage = () => {
    const canvasRef = useRef(null);

    const [selectedCategory, setSelectedCategory] = useState('rods');
    const [searchQuery, setSearchQuery] = useState('');
    const [equipment, setEquipment] = useState({
        rods: null,
        jackets: null,
        pants: null,
        boots: null,
    });

    const filteredProducts = useMemo(() => {
        return MOCK_PRODUCTS.filter(product =>
            product.category === selectedCategory &&
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [selectedCategory, searchQuery]);

    const handleEquip = (product) => {
        setEquipment(prev => ({
            ...prev,
            [product.category]: product.previewImage
        }));
    };

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
                // Рисуем фон как cover
                const scale = Math.max(canvas.width / bg.width, canvas.height / bg.height);
                const x = (canvas.width / 2) - (bg.width / 2) * scale;
                const y = (canvas.height / 2) - (bg.height / 2) * scale;
                ctx.drawImage(bg, x, y, bg.width * scale, bg.height * scale);
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
        // H-SCREEN и FLEX-COL: Это фиксирует высоту страницы ровно по экрану
        <div className="relative h-screen w-full overflow-hidden flex flex-col font-pixel">
            <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

            {/* Стиль для пикселизации при увеличении */}
            <style>{`
                .pixelated { image-rendering: pixelated; }
                /* Скрываем скроллбар для красоты, но оставляем функционал */
                .no-scrollbar::-webkit-scrollbar { display: none; }
                .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 16px; 
                }
                /* Фон полосы прокрутки (трек) */
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(0, 0, 0, 0.4); 
                    border: 2px solid #000;
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

            {/* 1. ШАПКА (Фиксированный размер) */}
            <div className="container mx-auto px-[5.5rem] pt-[1.125rem] flex-shrink-0">
                <Navbar />
            </div>

            {/* 2. ЗАГОЛОВОК (Фиксированный размер) */}
            <div className="flex flex-col items-center mt-2 mb-6 flex-shrink-0">
                <h1 className="text-4xl text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">
                    Подберите себе инвентарь
                </h1>
            </div>

            {/* 3. ФИЛЬТРЫ (Фиксированный размер) */}
            <div className="flex gap-4 mb-4 px-[5.5rem] flex-shrink-0">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Введите...."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[rgba(217,217,217,0.7)] text-black px-4 py-2 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.9)] focus:outline-none placeholder-gray-500"
                    />
                    <Search className="absolute right-3 top-2.5 text-black w-6 h-6" />
                </div>
                <div className="relative w-48">
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full appearance-none bg-[rgba(217,217,217,0.7)] text-black px-4 py-2 border-2 border-black shadow-[4px_4px_0_rgba(0,0,0,0.9)] focus:outline-none cursor-pointer placeholder-gray-500"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-2.5 text-black w-5 h-5 pointer-events-none" />
                </div>
            </div>

            {/* 4. ОСНОВНОЙ КОНТЕНТ (Занимает всё оставшееся место) */}
            {/* flex-1 min-h-0 - ключевые свойства, чтобы скролл был внутри этого блока */}
            <div className="flex-1 min-h-0 flex gap-8 px-[5.5rem] pb-8">

                {/* ЛЕВАЯ КОЛОНКА: ТОВАРЫ (Скроллится сама по себе) */}
                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-4">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => handleEquip(product)}
                                className="group relative bg-black/40 backdrop-blur-sm border-2 border-white/20 p-4 hover:border-yellow-400 transition-colors cursor-pointer flex flex-col min-h-[320px]"
                            >
                                {/* Картинка товара */}
                                <div className="h-40 bg-white/5 mb-4 flex items-start justify-start p-2 border border-white/10">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-contain object-left-top drop-shadow-lg pixelated"
                                        onError={(e) => {e.target.src = 'https://via.placeholder.com/150?text=No+Image'}}
                                    />
                                </div>

                                <h3 className="text-xl mb-2 text-white">{product.name}</h3>

                                <div className="text-gray-300 text-sm mb-4 space-y-1 flex-grow">
                                    {Object.entries(product.specs).map(([key, val]) => (
                                        <div key={key} className="flex justify-between border-b border-white/10 pb-1">
                                            <span className="capitalize text-gray-400">{key}:</span>
                                            <span className="text-white">{val}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-auto flex justify-between items-center pt-2">
                                    <span className="text-lg text-yellow-400">{product.price} ₽</span>
                                    <button className="bg-yellow-500 hover:bg-yellow-400 text-black text-sm px-4 py-2 border-b-4 border-yellow-700 active:border-b-0 active:translate-y-1 transition-all">
                                        Подробнее
                                    </button>
                                </div>
                            </div>
                        ))}

                        {filteredProducts.length === 0 && (
                            <div className="col-span-2 text-center text-gray-400 py-10 text-xl">
                                Товары не найдены...
                            </div>
                        )}
                    </div>
                </div>

                {/* ПРАВАЯ КОЛОНКА: ДЕДУШКА (Фиксированная, не скроллится) */}
                {/* Увеличил ширину до w-[450px] чтобы влез большой дед */}
                <div className="w-[450px] flex-shrink-0 relative h-full">
                    <div className="w-full h-full bg-black/30 backdrop-blur-md border-2 border-black shadow-[8px_8px_0_rgba(0,0,0,0.5)] flex flex-col items-center overflow-hidden relative">

                        <h2 className="text-2xl mt-6 mb-6 text-white drop-shadow-md z-50 relative">
                            Примерьте одежду!
                        </h2>

                        {/* ОБЛАСТЬ ПЕРСОНАЖА */}
                        {/* scale-150 увеличивает деда в 1.5 раза. translate-y-10 опускает его ниже */}
                        <div className="relative w-full h-full flex items-end justify-center pb-10">
                            <div className="relative w-full h-full transform scale-125 origin-bottom translate-y-10">
                                {/* 1. База */}
                                <img
                                    src={grandpaBase}
                                    alt="Character Base"
                                    className="absolute inset-0 w-full h-full object-contain z-10 pixelated"
                                />
                                {equipment.boots &&(
                                    <img
                                        src={equipment.boots}
                                        alt="Boots"
                                        className="absolute inset-0 w-full h-full object-contain z-20 pixelated"
                                    />
                                )}
                                {/* 2. Штаны */}
                                {equipment.pants && (
                                    <img
                                        src={equipment.pants}
                                        alt="Pants"
                                        className="absolute inset-0 w-full h-full object-contain z-30 pixelated"
                                    />
                                )}
                                {/* 3. Куртка */}
                                {equipment.jackets && (
                                    <img
                                        src={equipment.jackets}
                                        alt="Jacket"
                                        className="absolute inset-0 w-full h-full object-contain z-40 pixelated"
                                    />
                                )}
                                {/* 4. Удочка */}
                                {equipment.rods && (
                                    <img
                                        src={equipment.rods}
                                        alt="Rod"
                                        className="absolute inset-0 w-full h-full object-contain z-50 pixelated"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EquipmentPage;