import React from "react";
import SpotifyPlaylist from "../components/SpotifyPlaylist";
import NewsGrid from "./NewsGrid";
import technoImage from "../assets/techno 7.jpg";
import Interview from "../components/Interview";
import Header from "../components/Header"
import Footer from "../components/Footer"

function MagazinePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-2 flex-grow">
        <div
          className="bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${technoImage})` }}
        ></div>

        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="flex shadow-lg flex-col justify-center items-center">
            <NewsGrid />
          </div>
          <div className="p-6 shadow-lg flex flex-col justify-center items-center">
            <Interview />
          </div>
        </div>

        {/* Lateral Derecho */}
        <div className="bg-neutral-800 justify-center items-center text-white p-2 shadow-md md:col-span-1 hidden md:flex">
          Lateral Derecho
        </div>
      </div>

      {/* Laterales para pantallas pequeñas */}
      <div className="md:hidden flex gap-4 p-4">
        <div className="bg-amber-100 p-4 shadow-md flex-1">
          Lateral Izquierdo
        </div>
        <div className="bg-amber-700 p-4 rounded-lg shadow-md flex-1">
          Lateral Derecho
        </div>
      </div>
      <div className="w-full mt-10">
        <SpotifyPlaylist />
      </div>
      <Footer/>
    </div>
  );
}

export default MagazinePage;
