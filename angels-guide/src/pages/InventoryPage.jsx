import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';

import bgImg from '/src/assets/images/background/bubu.jpg';
import fisherImg from '/src/assets/images/spinning/fishman.png';

const InventorySlot = ({ title, itemName, id, position }) => (
    <div
        id={id}
        className={`absolute ${position} group cursor-pointer w-40 md:w-48 transition-all hover:scale-105 z-10`}
    >
        <div className="bg-[#abdcc2]/10 backdrop-blur-md border-2 border-black p-3 shadow-lg group-hover:border-[#FFBF00] group-hover:bg-[#FFBF00]/10">
            <div className="text-[10px] text-[#FFBF00] font-pixel uppercase mb-1">{title}</div>
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-black/40 border border-white/10 flex items-center justify-center">
                    <span className="text-lg">📦</span>
                </div>
                <div className="text-white font-pixel text-[11px] leading-tight">
                    {itemName || "Выбрать..."}
                </div>
            </div>
            <div className="w-full h-1 bg-black/50 mt-3 overflow-hidden">
                <div className="h-full bg-[#FFBF00] w-2/3 shadow-[0_0_5px_#FFBF00]"></div>
            </div>
        </div>
    </div>
);

const InventoryPage = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const bg = new Image(); bg.src = bgImg;
        const fisher = new Image(); fisher.src = fisherImg;

        let frame = 0;
        let animId;


        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Вызываем сразу

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.imageSmoothingEnabled = false;


            if (bg.complete) {
                ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);
            }

            const scaleY = bg.naturalHeight ? canvas.height / bg.naturalHeight : 1;
            const bob = Math.sin(frame * 0.08) * (4 * scaleY);

            if (fisher.complete) {
                ctx.drawImage(fisher, 0, bob, canvas.width, canvas.height);
            }


            const canvasRect = canvas.getBoundingClientRect();

            ctx.save();
            ctx.setLineDash([5, 8]);
            ctx.lineDashOffset = -frame * 0.3;
            ctx.strokeStyle = "rgba(255, 255, 255, 1)";
            ctx.lineWidth = 3.5;

            // Точки на рыбаке (в процентах от экрана)
            const anchorPoints = {
                left: { x: canvas.width * 0.36, y: canvas.height * 0.44 },
                left_mid:{ x:canvas.width * 0.35, y: canvas.height * 0.58 },
                right: { x: canvas.width * 0.54, y: canvas.height * 0.58 },
                feet: { x: canvas.width * 0.52, y: canvas.height * 0.69 },
                head: { x: canvas.width * 0.52, y: canvas.height * 0.5 },
                right_feed: { x: canvas.width * 0.33, y: canvas.height * 0.68 },
            };

            const slots = [
                { id: 'slot-rod', anchor: anchorPoints.left },
                { id: 'slot-bait', anchor: anchorPoints.left_mid },
                { id: 'slot-boots', anchor: anchorPoints.feet },
                { id: 'slot-hat', anchor: anchorPoints.head },
                { id: 'slot-clothe', anchor: anchorPoints.right },
                { id: 'slot-feed', anchor: anchorPoints.right_feed }
            ];

            slots.forEach(slot => {
                const el = document.getElementById(slot.id);
                if (el) {
                    const rect = el.getBoundingClientRect();

                    // ГЛАВНОЕ: вычитаем координаты холста из координат элементов
                    const startX = rect.left - canvasRect.left + rect.width / 2;
                    const startY = rect.top - canvasRect.top + rect.height / 2;

                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.lineTo(slot.anchor.x, slot.anchor.y + bob);
                    ctx.stroke();

                    ctx.fillStyle = "white";
                    ctx.setLineDash([]);
                    ctx.fillRect(startX - 2, startY - 2, 4, 4);
                    ctx.setLineDash([5, 8]);
                }
            });
            ctx.restore();

            frame++;
            animId = requestAnimationFrame(animate);
        };

        bg.onload = animate;

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="main-frame hero-section min-h-screen w-full relative overflow-hidden">
            <canvas ref={canvasRef} className="absolute inset-0 -z-10" />
            <div className="container mx-auto px-4 md:px-[5.5rem] pt-[1.125rem]">
                <Navbar />
            </div>

            <h1 className="text-center text-white text-3xl md:text-4xl font-pixel mt-6 md:mt-10 drop-shadow-[4px_4px_0_black]">
                Снаряжение героя
            </h1>

            {/* ЛЕВАЯ КОЛОНКА */}
            <InventorySlot id="slot-rod" title="Спиннинг" itemName="Shimano Catana" position="top-[25%] left-[2%] md:left-[10%]" />
            <InventorySlot id="slot-bait" title="Наживка" itemName="Жирный червь" position="top-[45%] left-[1%] md:left-[5%]" />
            <InventorySlot id="slot-feed" title="Прикормка" itemName="Дунаев Премиум" position="top-[65%] left-[2%] md:left-[10%]" />

            {/* ПРАВАЯ КОЛОНКА */}
            <InventorySlot id="slot-hat" title="Головной убор" itemName="Шляпа рыбака" position="top-[25%] right-[2%] md:right-[10%]" />
            <InventorySlot id="slot-clothe" title="Одежда" itemName="Ветровка камуфляж" position="top-[45%] right-[1%] md:right-[5%]" />
            <InventorySlot id="slot-boots" title="Сапоги" itemName="Болотники ЭВА" position="top-[65%] right-[2%] md:right-[10%]" />

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2">
                <button className="bg-[#FFBF00] border-2 border-black px-10 py-4 font-pixel text-black shadow-[inset_-4px_-4px_0_0_#B28601] hover:bg-[#FFD700] active:translate-y-1 transition-all uppercase">
                    Готово к выезду
                </button>
            </div>
        </div>
    );
};

export default InventoryPage;