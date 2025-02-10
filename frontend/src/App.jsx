import SpotifyPlaylist from './components/SpotifyPlaylist';
import Footer from './components/Footer';
import Header from './components/Header';
import MainPage from './components/MainPage';

function App() {
  return (
    <>
      {/* Contenedor principal con imagen de fondo y capa oscura */}
      <div className="relative bg-gray-900 text-white min-h-screen">

        {/* Imagen de fondo con efecto parallax */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('.\assets\fondo.webp')] 
                        bg-cover bg-fixed opacity-15 z-0"></div>

        {/* Capa oscura para mejorar legibilidad */}
        <div className="absolute top-0 left-0 w-full h-full bg-gray-900/80 z-0"></div>

        {/* Contenido de la página */}
        <div className="relative z-10 p-2">
          <Header title={"Adictos al Techno"} />
          <MainPage />
        </div>
        
      </div>

      {/* Secciones adicionales */}
      <SpotifyPlaylist />
      <Footer />
    </>
  );
}

export default App;
