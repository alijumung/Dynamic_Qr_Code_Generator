import React from 'react';
import '../homepage.css';
import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";

// import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
// import { loadBasic } from "@tsparticles/basic"; // if you are going to use `loadBasic`, install the "@tsparticles/basic" package too.



const HomePage = () => {
    const [init, setInit] = useState(false);
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
            // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
            // starting from v2 you can add only the features you need reducing the bundle size
            //await loadAll(engine);
            //await loadFull(engine);
            await loadSlim(engine);
            //await loadBasic(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
        console.log(container);
    };

    const options = useMemo(
        () => ({
            fpsLimit: 144,
            background: {
                color: {
                    value: "#fff",
                },
            },
            particles: {
                number: {
                    value: 150,
                    density: {
                        enable: true,
                        value_area: 800,
                    },
                },
                color: {
                    value: "#000",
                },
                shape: {
                    type: "circle",
                },
                opacity: {
                    value: 0.5,
                    random: true,
                },
                size: {
                    value: 3,
                    random: true,
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: "none",
                    outMode: "bounce",
                },
            },
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "repulse",
                    },
                    onClick: {
                        enable: true,
                        mode: "push",
                    },
                },
                modes: {
                    repulse: {
                        distance: 100,
                        duration: 0.4,
                    },
                    push: {
                        particles_nb: 4,
                    },
                },
            },
            detectRetina: true,
        }),
        [],
    );


     if (init)
         return (
             <>
        <Particles id="tsparticles" options={options} particlesLoaded={particlesLoaded}> </Particles>


            <div className="min-h-screen flex items-center justify-center text-center relative">


                {/* Box Container */}
                <div className="bg-transparent text-black rounded-lg p-8 w-96 relative z-10 custom_h1 rounded-md ">
                    {/* Logo */}
                    <div className="flex justify-center mb-4">
                        <h1 className="text-6xl tracking-widest">DEEPART</h1>
                    </div>

                    {/* Links */}
                    <div className="flex justify-center space-x-4 mt-7 mr-4">
                        <a
                            href="#"
                            className="flex items-center justify-center p-2 bg-transparent text-black border-2 font-bold border-black rounded-lg shadow-md hover:bg-black hover:text-white transition"
                        >
                            <i className="fa-brands fa-instagram"></i>
                        </a>
                        <a
                            href="#"
                            className="flex items-center justify-center p-2 bg-transparent text-black border-2 font-bold border-black rounded-lg shadow-md hover:bg-black hover:text-white transition"
                        >
                            <i className="fa-brands fa-facebook"></i>
                        </a>
                        <a
                            href="#"
                            className="flex items-center justify-center p-2 bg-transparent text-black border-2 font-bold border-black rounded-lg shadow-md hover:bg-black hover:text-white transition"
                        >
                            <i className="fa-brands fa-youtube"></i>
                        </a>
                        <a
                            href="#"
                            className="flex items-center justify-center p-2 bg-transparent text-black border-2 font-bold border-black rounded-lg shadow-md hover:bg-black hover:text-white transition"
                        >
                            <i className="fa-solid fa-globe"></i>
                        </a>
                    </div>
                </div>

            </div>
             </>


         );
};

export default HomePage;
