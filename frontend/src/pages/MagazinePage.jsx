import SpotifyPlaylist from '../components/SpotifyPlaylist';
import Footer from '../components/Footer';
import Header from '../components/Header';
import React, { useState, useEffect } from 'react';
import { getNoticias } from '../services/api';
import RedesSociales from '../components/RedesSociales';

function MagazinePage() {
    const [noticias, setNoticias] = useState([]);

    useEffect(() => {
        const fetchNoticias = async () => {
            const data = await getNoticias();
            setNoticias(data.slice(0, 4)); 
        };
        fetchNoticias();
    }, []);
  return (
    <>
      <div className="relative bg-gray-900 text-white min-h-screen">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('.\assets\fondo.webp')] bg-cover bg-fixed opacity-60 z-0"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900/80 z-0"></div>
        <div className="relative z-10 p-2">
          <Header title={"Adictos al Techno"} />
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

                <div className="bg-gray-900 p-4 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-white mb-2">Síguenos en redes</h3>
                    <div className="flex space-x-3 items-center">
                        <RedesSociales />
                    </div>
                </div>
            </aside>
        </main>
        </div>
      </div>
      <SpotifyPlaylist />
      <Footer />
    </>
  );
}

export default MagazinePage;
