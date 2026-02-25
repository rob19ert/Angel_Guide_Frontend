import React, { useEffect, useRef } from 'react';
import Navbar from "../components/Navbar.jsx";
// import { Settings, Edit, LogOut, Camera } from 'lucide-react'; // Если используются иконки

// ИМПОРТЫ КАРТИНОК (Оставляем ваши пути)
import bgImageSrc from '/src/assets/images/background/prof_bg.jpg';
import avatarSrc from '../assets/images/ded-Photoroom.png';
import fishIcon from '../assets/images/fish.jpg';

const MOCK_USER = {
    name: "Рыбак228",
    email: "fisher@bk.ru",
    phone: "89182028382",
    dob: "19.10.03",
    maxCatch: {
        name: "Сазан",
        weight: "1.5кг",
        image: fishIcon
    }
};

const MOCK_HISTORY = [
    { date: "19-12-26", fish: "Сазан", weight: "1кг" },
    { date: "18-12-26", fish: "Карп", weight: "1.5.." },
    { date: "17-12-26", fish: "Язь", weight: "0.5кг" },
    { date: "16-12-26", fish: "Карась", weight: "0.3кг" },
    { date: "15-12-26", fish: "Щука", weight: "1.2кг" },
    { date: "14-12-26", fish: "Окунь", weight: "0.4кг" },
    { date: "13-12-26", fish: "Лещ", weight: "0.8кг" },
    { date: "12-12-26", fish: "Плотва", weight: "0.1кг" },
    { date: "11-12-26", fish: "Сом", weight: "5.1кг" },
    { date: "10-12-26", fish: "Судак", weight: "2.1кг" },
];

const MOCK_PHOTOS = Array(8).fill(fishIcon);

const ProfilePage = () => {
    const canvasRef = useRef(null);


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
                ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
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

        <div className="relative h-screen w-full flex flex-col font-pixel text-black overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 -z-10" />

            <style>{`
                .pixelated { image-rendering: pixelated; }
                
                /* Стили для скроллбара (применяем ко всему скролл-контейнеру) */
                .custom-scroll::-webkit-scrollbar {
                    width: 20px;
                }
                .custom-scroll::-webkit-scrollbar-track {
                    background: #374151;
                    border-left: 2px solid black;
                }
                .custom-scroll::-webkit-scrollbar-thumb {
                    background-color: #facc15;
                    border: 2px solid black;
                }
            `}</style>


            <div className="container mx-auto px-4 md:px-[5.5rem] pt-[1.125rem] flex-shrink-0 z-10">
                <Navbar />
            </div>


            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scroll w-full mt-4">

                {/* Внутренний контейнер с отступами */}
                <div className="container mx-auto px-4 md:px-[5.5rem] pb-10 pt-4">


                    <div className="text-center mb-4">
                        <h1 className="text-4xl text-yellow-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] tracking-wider">
                            Профиль рыболова
                        </h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6 max-w-7xl mx-auto">


                        <div className="lg:col-span-3 bg-[#EAD4AA] border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,0.5)] p-6 flex flex-col relative">
                            <h2 className="text-3xl text-center mb-6 border-b-2 border-black/20 pb-2">Профиль</h2>

                            <div className="w-48 h-48 mx-auto bg-[#D4C095] border-4 border-black mb-6 relative overflow-hidden flex-shrink-0">
                                <img
                                    src={avatarSrc}
                                    alt="Avatar"
                                    className="w-full h-full object-cover pixelated"
                                    onError={(e) => {e.target.src = 'https://via.placeholder.com/150'}}
                                />
                            </div>

                            <div className="space-y-4 text-xl flex-grow">
                                <div><span className="block font-bold">Имя:</span> <span className="text-gray-800">{MOCK_USER.name}</span></div>
                                <div><span className="block font-bold">Email:</span> <span className="text-gray-800 break-words">{MOCK_USER.email}</span></div>
                                <div><span className="block font-bold">Телефон:</span> <span className="text-gray-800">{MOCK_USER.phone}</span></div>
                                <div><span className="block font-bold">Дата рожд.:</span> <span className="text-gray-800">{MOCK_USER.dob}</span></div>
                            </div>

                            <button className="w-full mt-6 bg-yellow-500 hover:bg-yellow-400 border-4 border-black py-3 text-lg shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
                                Изменить данные
                            </button>
                        </div>


                        <div className="lg:col-span-3 flex flex-col gap-6">
                            <div className="bg-[#EAD4AA] border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,0.5)] p-6 flex flex-col gap-4">
                                <h2 className="text-2xl text-center mb-2">Настройки</h2>
                                <button className="bg-yellow-500 hover:bg-yellow-400 border-4 border-black py-3 text-xl shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
                                    Избранное
                                </button>
                                <button className="bg-yellow-500 hover:bg-yellow-400 border-4 border-black py-3 text-xl shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
                                    Редактировать
                                </button>
                                <button className="bg-yellow-500 hover:bg-yellow-400 border-4 border-black py-3 text-xl shadow-[4px_4px_0_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all">
                                    Смена данных
                                </button>
                            </div>


                            <div className="bg-[#EAD4AA] border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,0.5)] p-4 h-48">
                                <h2 className="text-2xl text-center mb-4 leading-6">Максимальный<br/>улов</h2>
                                <div className="flex gap-4 items-center">
                                    {/* Фото рыбы (Полароид стиль) */}
                                    <div className="w-24 h-24 bg-white p-1 border-2 border-black shadow-sm transform -rotate-3">
                                        <img
                                            src={MOCK_USER.maxCatch.image}
                                            alt="Max Catch"
                                            className="w-full h-full object-cover border border-gray-300 pixelated"
                                        />
                                    </div>

                                    <div className="text-xl">
                                        <p className="">{MOCK_USER.maxCatch.name} —</p>
                                        <p>{MOCK_USER.maxCatch.weight}</p>
                                    </div>
                                </div>
                            </div>
                        </div>


                        <div className="lg:col-span-4 flex flex-col gap-6">
                            {/* Фото улова */}
                            <div className="bg-[#EAD4AA] border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,0.5)] p-4">
                                <h2 className="text-2xl text-center mb-4">Фото улова</h2>
                                <div className="grid grid-cols-4 gap-2">
                                    {MOCK_PHOTOS.map((photo, index) => (
                                        <div key={index} className="aspect-square bg-white border-2 border-black p-1">
                                            <div className="w-full h-full bg-blue-200 overflow-hidden">
                                                <img src={photo} alt="catch" className="w-full h-full object-cover pixelated hover:scale-110 transition-transform" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>


                            <div className="bg-[#EAD4AA] border-4 border-black shadow-[8px_8px_0_rgba(0,0,0,0.5)] p-0 flex flex-col h-80 overflow-hidden relative">
                                <h2 className="text-2xl text-center py-2 border-b-4 border-black bg-[#D4C095]">
                                    История улова
                                </h2>
                                <div className="flex-1 overflow-y-auto custom-scroll p-4">
                                    <ul className="space-y-2 text-xl font-mono">
                                        {MOCK_HISTORY.map((item, idx) => (
                                            <li key={idx} className="flex justify-between border-b border-black/10 pb-1">
                                                <span className="text-gray-700 w-24">{item.date}</span>
                                                <span className="flex-1 text-center">{item.fish}</span>
                                                <span className="text-gray-800 w-16 text-right">{item.weight}</span>
                                            </li>
                                        ))}

                                        {MOCK_HISTORY.map((item, idx) => (
                                            <li key={`dup-${idx}`} className="flex justify-between border-b border-black/10 pb-1">
                                                <span className="text-gray-700 w-24">{item.date}</span>
                                                <span className="flex-1 text-center">{item.fish}</span>
                                                <span className="text-gray-800 w-16 text-right">{item.weight}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;