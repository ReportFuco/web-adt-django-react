import React from "react";
import Header from "../components/Header";
import SpotifyPlaylist from "../components/SpotifyPlaylist";
import Footer from "../components/Footer";
import NewsGrid from "./NewsGrid"

function TestingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header title="AdT" />
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 flex-grow">

        <div className="bg-amber-100 p-4 rounded-lg shadow-md md:col-span-1 hidden md:flex">
          Lateral Izquierdo
        </div>

        <div className="md:col-span-4 flex flex-col gap-4">
          <div className="flex flex-col justify-center items-center">
            <NewsGrid/>
            
          </div>
          <div className="bg-amber-300 p-6 shadow-lg rounded-lg flex flex-col justify-center items-center">
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cupiditate eos vitae similique, ex est maiores debitis libero illum molestiae facilis ut consequatur fugiat cumque, quisquam, accusamus quia deleniti repellat! Cupiditate.
            Illum deleniti expedita magnam cupiditate iusto doloremque. Atque quae qui vero temporibus, error quos totam voluptatibus ducimus facilis sint veniam voluptate similique quia, exercitationem delectus amet, beatae vitae optio maiores.
            Dolor vitae aliquam in consequatur eveniet quod. Alias pariatur nemo perspiciatis quaerat. Velit laudantium cupiditate, quam accusantium incidunt quos veritatis distinctio debitis nemo quia odit aspernatur quidem, doloremque repellendus placeat!
          </div>
        </div>

        {/* Lateral Derecho */}
        <div className="bg-amber-700 p-4 rounded-lg shadow-md md:col-span-1 hidden md:flex">
          Lateral Derecho
        </div>
      </div>

      {/* Laterales para pantallas pequeñas */}
      <div className="md:hidden flex gap-4 p-4">
        <div className="bg-amber-100 p-4 rounded-lg shadow-md flex-1">
          Lateral Izquierdo
        </div>
        <div className="bg-amber-700 p-4 rounded-lg shadow-md flex-1">
          Lateral Derecho
        </div>
      </div>

      {/* Componente Spotify */}
      <div className="w-full mt-10">
        <SpotifyPlaylist />
      </div>

      <div>
        <Footer />
      </div>
    </div>


  );
}

export default TestingPage;
