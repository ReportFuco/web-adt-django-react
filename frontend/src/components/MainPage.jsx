import React, { useState, useEffect } from 'react';
import { getNoticias } from '../services/api';

export default function MainPage() {
    const [noticias, setNoticias] = useState([]);

    useEffect(() => {
        const fetchNoticias = async () => {
            const data = await getNoticias();
            setNoticias(data.slice(0, 4)); // Solo toma las últimas 4 noticias
        };
        fetchNoticias();
    }, []);

    return (
        <main className="max-w-6xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sección principal de noticias */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
    {noticias.map((noticia) => (
        <div key={noticia.id} className="bg-gray-800 rounded-none shadow-lg hover:scale-105 transition-transform duration-300 overflow-hidden w-full min-h-[350px]">
            {noticia.imagen && (
                <img
                    src={noticia.imagen}
                    alt={noticia.titulo}
                    className="w-full h-60 object-cover"
                />
            )}
            <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-300">{noticia.titulo}</h2>
                <p className="text-gray-300 mt-2">{noticia.contenido}</p>
            </div>
        </div>
    ))}
</div>

            {/* Columna lateral con publicidad y redes sociales */}
            <aside className="p-4 shadow-md rounded-none md:col-span-1 md:row-auto order-last md:order-none">
                {/* Sección de publicidad */}
                <div className="mb-6 bg-amber-50 rounded-none shadow-md md:col-span-1 md:row-auto order-last md:order-none">
                    <h3 className="text-lg font-semibold text-gray-800">Publicidad</h3>
                    <div className="w-full h-40 bg-gray-300 flex items-center justify-center">
                        <span className="text-gray-600">Espacio Publicitario</span>
                    </div>
                </div>

                {/* Sección de redes sociales */}
                <div className='bg-amber-50'>
                    <h3 className="text-lg font-semibold text-gray-800">Síguenos en redes</h3>
                    <div className="flex flex-col gap-3 mt-3">
                        <a href="#" className="flex items-center text-blue-600 hover:underline">
                            <img src="/icons/facebook.png" alt="Facebook" className="w-6 h-6 mr-2" />
                            Facebook
                        </a>
                        <a href="#" className="flex items-center text-blue-400 hover:underline">
                            <img src="/icons/twitter.png" alt="Twitter" className="w-6 h-6 mr-2" />
                            Twitter
                        </a>
                        <a href="#" className="flex items-center text-pink-600 hover:underline">
                            <img src="/icons/instagram.png" alt="Instagram" className="w-6 h-6 mr-2" />
                            Instagram
                        </a>
                    </div>
                </div>
            </aside>
        </main>
    );
}