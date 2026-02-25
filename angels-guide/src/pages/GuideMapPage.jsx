import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

import bgImg from '../assets/images/background/bg_plan.jpg';
import fishermanImg from '../assets/images/purple_fisherman.png';

const GuideMapPage = () => {
    const canvasRef = useRef(null);

    // Ноды и связи
    const connNode = [
        {from:"node-lake", to: "node-fish"},
        {from:"node-lake", to: "node-feed"},
        {from:"node-fish", to: "node-clothe"},
        {from:"node-clothe", to: "node-spin"},
        {from:"node-spin", to: "node-lut"},
        {from:"node-feed", to: "node-clothe"},
        {from:"node-lake", to: "node-day"},
        {from:"node-day", to: "node-bait"},
        {from: "node-lut", to: "node-bait"}
    ];

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationId;

        const bg = new Image(); bg.src = bgImg;
        const fisherman = new Image(); fisherman.src = fishermanImg;
        let frame = 0;
        let ripples = [];

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();

        function createRipple(x,y) {
            ripples.push({ x: x, y: y, r: 1, alpha: 0.8 });
        }

        function drawRipples() {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 2;
            for (let i = ripples.length - 1; i >= 0; i--) {
                let r = ripples[i];
                ctx.globalAlpha = r.alpha;
                ctx.beginPath();
                ctx.ellipse(r.x, r.y, r.r, r.r * 0.4, 0, 0, Math.PI * 2);
                ctx.stroke();
                r.r += 0.3;
                r.alpha -= 0.01;
                if (r.alpha <= 0) ripples.splice(i, 1);
            }
            ctx.globalAlpha = 1;
        }
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.imageSmoothingEnabled = false;

            if (bg.complete) ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

            const scaleY = bg.naturalHeight ? canvas.height / bg.naturalHeight : 1;
            const fishermanPlanning = Math.sin(frame * 0.08) * (4 * scaleY);

            ctx.save();
            ctx.globalAlpha = 1;
            if (fisherman.complete) ctx.drawImage(fisherman, 0, fishermanPlanning, canvas.width, canvas.height);
            ctx.restore();

            // Линии
            const canvasRect = canvas.getBoundingClientRect();
            ctx.save();
            ctx.strokeStyle = "rgba(255, 209, 4, 0.9)";
            ctx.lineWidth = 2.5;
            ctx.setLineDash([5, 10]);
            ctx.lineDashOffset = -frame * 0.2;

            connNode.forEach(conn => {
                const fromElem = document.getElementById(conn.from);
                const toElem = document.getElementById(conn.to);
                if (fromElem && toElem) {
                    const rect1 = fromElem.getBoundingClientRect();
                    const rect2 = toElem.getBoundingClientRect();
                    // Вычисляем центры элементов относительно канваса
                    const x1 = rect1.left - canvasRect.left + rect1.width / 2;
                    const y1 = rect1.top - canvasRect.top + rect1.height / 2;
                    const x2 = rect2.left - canvasRect.left + rect2.width / 2;
                    const y2 = rect2.top - canvasRect.top + rect2.height / 2;

                    ctx.beginPath();
                    ctx.moveTo(x1, y1);
                    ctx.lineTo(x2, y2);
                    ctx.stroke();
                }
            });
            ctx.restore();
            const rodX = 0.335;
            const rodY = 0.68;
            const lineX = canvas.width * rodX;
            const lineY = canvas.height * rodY;

            if (frame % 60 === 0) {
                createRipple(lineX, lineY);
            }
            drawRipples();

            frame++;
            animationId = requestAnimationFrame(animate);
        }

        bg.onload = animate;
        // Если уже загружено
        if(bg.complete) animate();

        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationId);
        }
    }, []);

    const NodeButton = ({ id, bgColor, shadowColor, text, top, left, link }) => {

        const dynamicStyle = {
            backgroundColor: bgColor,
            boxShadow: `inset -7px -7px 0 0 ${shadowColor}`,
            top: top,
            left: left
        };

        const buttonContent = (
            <button
                style={dynamicStyle}
                className="w-[9rem] h-[4rem] font-pixel border-2 border-black text-white text-base hover:-translate-y-1 transition-all active:translate-y-1 active:shadow-none"
            >
                {text}
            </button>
        );

        return (
            <div id={id} className="absolute flex flex-col items-center" style={{ top, left }}>
                {link ? <Link to={link}>{buttonContent}</Link> : buttonContent}
            </div>
        );
    };

    return (
        <div id="plan" className="relative main-frame hero-section min-h-screen w-full bg-center">
            <canvas ref={canvasRef} id="planCanvas" className="absolute top-0 left-0 w-full h-full -z-10 object-cover"></canvas>
            <div className="container mx-auto px-[5.5rem] pt-[1.125rem]">
                <Navbar />
            </div>
            <div className="font-pixel text-4xl text-center pt-[1rem] text-white drop-shadow-[3px_3px_0_rgba(0,0,0,1)]">
                Путеводитель рыболова
            </div>

            <NodeButton id="node-lake"
                        top="35%"
                        left="5%"
                        text="Выбрать водоем"
                        link="/map"
                        bgColor="#DDA80B"
                        shadowColor="rgba(178,124,1,0.65)" />
            <NodeButton id="node-fish"
                        top="25%"
                        left="22%"
                        text="Выбрать рыбу"
                        link="/fish"
                        bgColor="#DDA80B"
                        shadowColor="rgba(178,124,1,0.65)"
            />

            <NodeButton
                id="node-feed"
                top="45%"
                left="22%"
                text="Выбрать прикормку"
                bgColor="#90B10C"
                shadowColor="#647E00"
            />
            <NodeButton id="node-day"
                        top="76%"
                        left="5%"
                        text="Выбрать день"
                        bgColor="#DDA80B"
                        shadowColor="rgba(178,124,1,0.65)"
            />

            <NodeButton id="node-bait"
                        top="76%"
                        left="86%"
                        text="Выбрать наживку"
                        bgColor="#90B10C"
                        shadowColor="#647E00"
            />
            <NodeButton
                id="node-clothe"
                top="35%"
                left="56%"
                text="Выбрать одежду"
                link="/equipment"
                bgColor="#DDA80B"
                shadowColor="rgba(178,124,1,0.65)"
            />
            <NodeButton
                id="node-spin"
                top="35%"
                left="73%"
                text="Выбрать удочку"
                link="/equipment"
                bgColor="#90B10C"
                shadowColor="#647E00"
            />
            <NodeButton
                id="node-lut"
                top="55%"
                left="73%"
                text="Выбрать инвентарь"
                bgColor="#90B10C"
                shadowColor="#647E00"
            />
        </div>
    );
};

export default GuideMapPage;