import SpotifyPlaylist from './components/SpotifyPlaylist';
import Footer from './components/Footer';
import Header from './components/Header';
import MainPage from './components/MainPage';


function App() {
  return (
    <>
    <div className="bg-gray-900 text-white min-h-screen p-2">
      {/* Encabezado */}
      <Header title={"Noticias Musica Techno"}/>

      {/* Contenedor de Noticias */}
      <MainPage />
    </div>

    <SpotifyPlaylist/>
    <Footer/>

    </>
  );
}

export default App;
