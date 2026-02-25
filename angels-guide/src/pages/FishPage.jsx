import React, { useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

// Картинки
import bgImg from '../assets/images/purple.jpg';
import fishermanImg from '../assets/images/spinning/fishman.png';
import birdImg from '../assets/images/bird.png';

const FishPage = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const bg = new Image(); bg.src = bgImg;
        const fisherman = new Image(); fisherman.src = fishermanImg;
        const bird = new Image(); bird.src = birdImg;

        let ripples = [];
        let frame = 0;
        let birdX = -100;
        let birdY = 50;
        let birdSpeed = 1.5;
        let animationId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

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
            if(bg.complete) ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

            birdX += birdSpeed;
            const birdPlanning = Math.sin(frame * 0.1) * 5;
            if(bird.complete) ctx.drawImage(bird, birdX, birdY + birdPlanning);

            if (birdX > canvas.width) {
                birdX = -250;
                birdY = Math.random() * 200 + 50;
            }


            const fishY = canvas.height / bg.naturalHeight; // + базовый Y если нужно
            const bobbing = Math.sin(frame * 0.08) * (4 * fishY);
            ctx.save();
            if(fisherman.complete) ctx.drawImage(fisherman, 0, bobbing, canvas.width, canvas.height);

            // Координаты поплавка (примерные, в оригинале были 440, 660 для фикс. размера)
            // В адаптивном дизайне лучше привязывать к % ширины
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

        bg.onload = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            animate();
        }
        if(bg.complete) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            animate();
        }

        return () => cancelAnimationFrame(animationId);
    }, []);

    // Повторяющаяся SVG иконка (для сокращения)
    const FishIcon = () => (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 hover:fill-[#FFBF00]" viewBox="0 0 1120 944" width="1120" height="944"><path fill="currentColor" fillRule="evenodd" d="M690.2 89.2c5.5 1.6 12.6 8.3 15.4 14.3 3.1 6.5 3.2 16.1.3 22.5-1.5 3.4-17.2 19.7-66.9 69.5l-65 65 97 97 97 97 25.2-25.2c97-96.5 117.5-116.5 121.8-118.6 6.1-3 15.7-3 22.3.1 3.9 1.7 13.3 10.6 45 42.7 44.1 44.5 44.6 45.2 44.7 56.6 0 10.6-2.6 14-34.5 45.9L964 484.5l28.9 29c19 19 29.6 30.5 31.1 33.4 3.3 6.7 3.7 14.3 1 21.6-2.1 5.7-4.5 8.2-42.4 46.2-26.8 26.8-41.6 40.9-44.6 42.4-3.5 1.9-6.1 2.4-12 2.4-6.5 0-8.3-.5-12.8-3-3.7-2.1-23.8-21.5-68-65.5-34.5-34.4-66-65.6-70-69.5l-7.3-6.9-96.9 96.9-97 97 64.3 64.2c48 48 64.9 65.5 67 69.4 2.2 4.2 2.7 6.4 2.7 12 0 11-4.8 18.8-15 24.1l-4.5 2.3H517.4l-5.7-3c-4.5-2.4-40.8-38.1-192.7-189.4-156.1-155.6-187.4-187.3-189.6-191.7-2.3-4.7-2.6-6.3-2.2-13.1.2-4.8 1.1-9.2 2.2-11.5 1.9-4 373.9-375.3 380.3-379.6 2-1.4 4.7-2.8 6.2-3.2 4.4-1.4 169.7-1.2 174.3.2M440.3 234.9c-51.9 51.6-94.3 94.2-94.3 94.7s9.3 10.2 20.8 21.7l20.7 20.7L503 256.5 618.5 141h-42l-42 .1zM518.1 315.7c-10 9.9-18.1 18.4-18.1 18.9s8.2 9.1 18.3 19.2l18.2 18.2 18.5-18.5 18.5-18.5-18.7-18.6-18.6-18.7zM289.1 385.4l-18.4 18.4 2.7 3.4c3 4.1 38.4 38.8 39.4 38.8.4 0 8.9-8.2 19-18.3l18.2-18.2-21.3-21.3-21.2-21.2zM907.2 390.7l-18.4 18.6 18.4 18.4c10 10 18.8 18.3 19.3 18.3.6 0 9.1-8.1 18.9-18.1l17.9-18-15.5-15.7c-8.6-8.6-16.9-17.2-18.6-19-1.6-1.7-3.2-3.2-3.4-3.1-.1 0-8.6 8.4-18.6 18.6M443.7 390.8C434 400.5 426 409 426 409.5c0 .6 8.1 9.1 17.9 18.9l18 17.9 3.3-2.9c1.8-1.7 10.1-10 18.5-18.5l15.2-15.5-18.2-18.2c-10-10-18.4-18.2-18.7-18.2s-8.5 8-18.3 17.8M592.7 390.8C583 400.5 575 409 575 409.5c0 .6 8.1 9.1 18 19l18 18 18.5-18.5 18.5-18.5-18-18c-9.9-9.9-18.4-18.1-18.8-18.3-.4-.1-8.7 7.8-18.5 17.6M211.4 463.3l-21.1 21.2 21.1 21.2 21.2 21.3 21.2-21.3 21.3-21.3-21.1-21c-11.6-11.5-21.2-21-21.4-21.1-.1-.1-9.7 9.3-21.2 21M369.2 465.3c-10 10-18.2 18.7-18.2 19.2.1.6 8.2 9.1 18 19l17.9 18 18.8-18.8 18.8-18.7-18.5-18.5-18.5-18.5zM518 465.5 499.5 484l18.8 18.8 18.7 18.7 18-18.3c9.9-10.1 18-18.7 18-19 0-.4-8.2-8.9-18.3-19L536.5 447zM667 465.5 648.5 484l18.8 18.7 18.7 18.8 18-18c9.9-9.9 18-18.4 18-19s-8.2-9.2-18.3-19.3L685.5 447zM831.7 465.8 813 484.5l18.9 18.9 18.9 18.9 18.6-18.5c10.2-10.1 18.6-18.9 18.6-19.5 0-1.2-35.8-37.3-36.9-37.3-.4 0-9.1 8.4-19.4 18.8M291.6 542.9l-20.9 21 3.3 3.8c4.9 5.7 33.3 33.4 34 33.1.3-.2 9.7-9.7 21-21.1l20.4-20.8-18.4-18.4-18.5-18.5zM443.2 540.3l-18.3 18.3 18.1 17.9c9.9 9.9 18.4 18 18.9 18s9.1-8.1 19.1-17.9l18.2-17.9-18.4-18.4c-10-10-18.5-18.3-18.8-18.3s-8.7 8.2-18.8 18.3M592.3 540.3 574 558.5l18.3 18.3c10 10 18.7 18.2 19.2 18.2.6 0 9.1-8.1 19-18l18-18-18.5-18.5c-10.2-10.2-18.7-18.5-19-18.5s-8.7 8.2-18.7 18.3M907 540.5 888.5 559l18 18c9.9 9.9 18.7 18 19.5 18s9.6-8.1 19.5-18l18-18-18.5-18.5c-10.2-10.2-18.7-18.5-19-18.5s-8.8 8.3-19 18.5M365.7 617.8 345 638.5l94.3 94.3 94.4 94.2h83.8l-115-115C439.3 648.7 387.3 597 387 597s-9.8 9.3-21.3 20.8M523.5 609.9c-7.2 7-15.5 15.3-18.4 18.4l-5.3 5.6 18.3 18.6 18.3 18.6 18.8-18.8 18.8-18.8-18.2-18.2C545.7 605.2 537.3 597 537 597s-6.4 5.8-13.5 12.9" /></svg>
    )

    return (
        <div id="fish" className="relative main-frame hero-section min-h-screen w-full bg-center">
            <canvas ref={canvasRef} id="gameCanvas" className="absolute top-0 left-0 w-full h-full -z-10 object-cover"></canvas>

            <div className="container mx-auto px-[5.5rem] pt-[1.125rem]">
                <Navbar />
            </div>

            <div className="text-center px-[5.5rem] mb-4">
                <h1 className="text-white text-4xl font-pixel drop-shadow-[2px_2px_0_rgba(0,0,0,0.8)]">Выберите желаемую рыбу</h1>
                <h2 className="text-[#FFBF00] pt-4 text-2xl font-pixel drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">Озеро Круглое</h2>
            </div>

            <div className="flex gap-8 w-full px-[5.5rem] items-start pt-[1rem]">
                {/* Левый блок со списком рыб */}
                <div className="flex-1 flex flex-col">
                    <div className="bg-[rgba(157,127,80,0.71)] border-2 border-black p-6 font-pixel shadow-[inset_-10px_-10px_0_0_rgba(0,0,0,0.3)] h-[18rem] overflow-y-auto">
                        <p className="text-white text-2xl text-center drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">Список рыб</p>
                        <div className="grid grid-cols-2 gap-y-4 gap-x-10 justify-items-start w-full pt-[1rem]">
                            {/* Повторяем рыбок (для примера несколько штук) */}
                            {['Карась', 'Щука', 'Сазан', 'Окунь', 'Ёрш', 'Ротан', 'Язь', 'Судак'].map((fish) => (
                                <div key={fish} className="flex items-center justify-center gap-3 text-white cursor-pointer hover:scale-105 transition-transform hover:text-[#FFBF00]">
                                    <FishIcon />
                                    <span className="text-[1.125rem] drop-shadow-[4px_4px_4px_rgba(0,0,0,1)]">{fish}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-4 mt-8 justify-between">
                        <button className="flex-1 my-3 py-5 bg-[#5c4a33] text-white border-2 border-black font-pixel shadow-[inset_-4px_-4px_0_0_rgba(0,0,0,0.3)] hover:brightness-110 hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all">Водоемы</button>
                        <button className="flex-1 my-3 py-5 bg-[#5c4a33] text-white border-2 border-black font-pixel shadow-[inset_-4px_-4px_0_0_rgba(0,0,0,0.3)] hover:brightness-110 hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all">Меню</button>
                        <button className="flex-1 my-3 py-5 bg-[#5c4a33] text-white border-2 border-black font-pixel shadow-[inset_-4px_-4px_0_0_rgba(0,0,0,0.3)] hover:brightness-110 hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all">Карта</button>
                    </div>
                </div>

                {/* Правый блок для графика */}
                <div className="flex-1 bg-[rgba(157,127,80,0.71)] border-2 border-black p-6 font-pixel shadow-[inset_-10px_-10px_0_0_rgba(0,0,0,0.3)] h-[25rem] flex flex-col">
                    <p className="text-white text-2xl text-center drop-shadow-[2px_2px_0_rgba(0,0,0,1)] flex-none">График клева</p>
                    <p className="text-white text-center text-base drop-shadow-[2px_2px_0_rgba(0,0,0,1)] pt-[1rem] flex-none">На ближайшие 6 часов</p>
                    <div className="relative flex-1 w-full mt-4 min-h-0">
                        <svg className="w-full h-full" viewBox="0 0 445 169" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
                            <line x1="0" y1="84.5" x2="445" y2="84.5" stroke="white" strokeOpacity="0.2" strokeWidth="2" strokeDasharray="8 6" />
                            <line x1="111" y1="0" x2="111" y2="169" stroke="white" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4" />
                            <line x1="222" y1="0" x2="222" y2="169" stroke="white" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4" />
                            <line x1="333" y1="0" x2="333" y2="169" stroke="white" strokeOpacity="0.4" strokeWidth="1" strokeDasharray="4 4" />
                            <text x="5" y="80" fill="white" fillOpacity="0.5" fontSize="12" className="font-pixel">50%</text>
                            <path d="M2.5 166.132C2.5 166.356 2.5 166.58 2.78644 166.472C5.16084 165.572 8.55307 161.571 11.9948 161.571C16.3251 161.571 17.8894 157.619 20.0368 155.525C22.8731 152.759 23.6723 148.838 25.4083 145.782C27.1465 142.722 27.8259 140.82 28.6974 137.989C29.752 134.564 31.6423 128.8 33.0276 125.291C34.387 121.848 35.1231 118.211 36.7393 113.803C37.832 110.822 43.6384 107.299 44.1626 104.128C44.7023 100.863 45.2668 100.062 46.0185 96.2673C46.6151 93.2559 46.8292 91.125 47.8743 88.4066C48.9568 85.591 49.9831 82.6795 50.9674 79.3366C51.9825 75.8893 52.0768 74.4166 54.679 71.476C57.3897 68.4127 59.6703 70.8135 62.1024 69.0573C64.8368 67.0828 66.0085 60.7569 68.8048 60.7569C72.0002 60.7569 72.4215 66.848 75.0932 69.0573C77.4392 70.9972 82.8893 69.0443 85.6096 71.476C88.3567 73.9315 92.8144 125.291 97.3633 125.291C105 125.291 105.486 77.2233 115.302 77.1571C119.866 77.1263 119.746 94.4533 123.345 94.4533C125.819 94.4533 131.781 94.4533 135.717 94.4533C139.429 94.4533 141.741 100.523 142.522 103.523C143.151 105.942 143.719 108.666 144.996 111.384C146.274 114.102 147.917 120.877 151.182 120.877C153.657 120.877 154.791 111.384 157.987 111.384C161.5 111.384 161.757 123.935 165.149 123.935C170 123.935 173.708 147.059 177.164 147.059C180.257 147.059 187.629 120.482 191.392 117.431C194.393 114.998 200.097 106.357 202.527 103.523C204.718 100.97 204.146 92.3773 206 90C208.49 86.8069 211.188 87.1973 212.425 84.174C213.803 80.8055 213.646 79.8637 214.924 76.918C216.784 72.6289 218.158 69.8383 219.609 66.034C220.991 62.4118 221.75 59.4566 223.373 55.1499C225.301 50.0338 225.787 48.7983 226.653 46.0799C227.663 42.9101 232.857 37.985 234.134 34.5913C235.53 30.8834 238.407 27.0619 240.327 23.7072C242.291 20.2752 243.084 17.8449 244.593 15.2419C246.102 12.6378 245.505 8.59054 250.16 8.59055C254 8.59057 252.958 2.49998 256.234 2.5C259.439 2.50002 259.824 8.59055C266 8.59055 264.738 13.2447 269.5 15.2419C272.5 16.5 273.703 22.2816 275.5 25C277.174 27.5327 278.46 31.8729 279.5 34.5913C280.495 37.1925 281.568 37.3533 283.5 39.8824C285.5 42.5 286.754 45.779 287 46.5147C288 49.5 290.301 71.2353 293.5 71.2353C297 71.2353 300.954 47.1701 305.363 47.1701C310 47.1701 310.645 52.285 311.5 55.1499C312.5 58.5 313.372 63.236 316.074 63.236C319.5 63.236 325.776 26.0147 329 26.0147C332 26.0147 340.5 59.5007 341.5 63.236C342.492 66.9412 345.261 80.345 347 83.2941C348.484 85.8099 350.264 90.992 352 93.5441C353.824 96.2249 353.622 98.5486 356 101.382C358.081 103.862 361.1 111.249 362.5 114.647C364.5 119.5 372.5 141.176 374.5 141.176C376.5 141.176 382.27 117.213 384 114.647C391.5 103.523 398.023 106.019 400 102.5C402.097 98.7681 403.243 89.7274 404 86.5C404.925 82.5549 406.068 72.2557 407 68C407.657 65.0019 408.455 61.3451 409.5 57.5C410.331 54.4435 411.837 51.0736 413 47.5C414.194 43.8326 415.692 39.2317 418.5 36.8676C422.5 33.5 422.752 33.5506 425.999 32.6471C432.5 30.8382 439.5 30.8382 442.5 30.8382" stroke="#FFBF00" strokeWidth="5" strokeLinecap="round"/>
                        </svg>
                        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/10 to-transparent h-4 w-full animate-scan"></div>
                    </div>
                    <div className="flex justify-between items-center px-4 mt-2 flex-none">
                        <span className="text-white text-xs">12:00</span>
                        <span className="text-white text-xs">13:00</span>
                        <span className="text-white text-xs">14:00</span>
                        <span className="text-white text-xs">15:00</span>
                        <span className="text-white text-xs">16:00</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FishPage;