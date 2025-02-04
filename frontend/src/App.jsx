import { useEffect, useState } from 'react';
import { getNoticias } from './services/api';
import SpotifyPlaylist from './components/SpotifyPlaylist';
import Footer from './components/Footer';

function App() {
  const [noticias, setNoticias] = useState([]);

  useEffect(() => {
    const fetchNoticias = async () => {
      const data = await getNoticias();
      setNoticias(data);
    };
    fetchNoticias();
  }, []);

  return (
    <>
    <div className="bg-gray-900 text-white min-h-screen p-6">
      {/* Encabezado */}
      <h1 className="w-full rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-3 text-xl font-bold text-center shadow-md">
        Noticias Música Techno
      </h1>

      {/* Contenedor de Noticias */}
      <div className="max-w-4xl mx-auto mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {noticias.length === 0 ? (
          <p className="text-center text-gray-400">Cargando noticias...</p>
        ) : (
          noticias.map((noticia) => (
            <div key={noticia.id} className="bg-gray-800 p-5 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
              <h2 className="text-xl font-semibold text-blue-400">{noticia.titulo}</h2>
              <p className="text-gray-300 mt-2">{noticia.contenido}</p>
              {noticia.imagen && (
                <img
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  className="mt-4 w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>

    <SpotifyPlaylist/>
    <Footer/>

    </>
  );
}

export default App;
