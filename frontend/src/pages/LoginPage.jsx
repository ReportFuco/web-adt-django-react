import React from "react";
import { useNavigate } from "react-router-dom";
import userIcon from "../assets/icons/user-solid.svg";
import lockIcon from "../assets/icons/lock-solid.svg";
import googleIcon from "../assets/icons/google-brands-solid.svg";
import facebookIcon from "../assets/icons/facebook-f-brands-solid.svg";
import xIcon from "../assets/icons/x-twitter-brands-solid black.svg"



function Container() {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('.\assets\fondo.webp')] bg-cover bg-fixed opacity-60">
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900/80 z-0"></div>
      <div className="absolute bg-black p-8 rounded-lg shadow-lg text-white w-96">
        <h2 className="text-2xl font-bold text-center mb-8">Iniciar Sesión</h2>
        <div className="space-y-4">
          {/* Input con Icono de Usuario */}
          <div className="relative hover:scale-105 transition-transform duration-300">
            <img 
              src={userIcon} 
              alt="Usuario" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
            <input 
              type="text" 
              placeholder="Usuario" 
              className="w-full pl-10 p-3 bg-neutral-700 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Input con Icono de Contraseña */}
          <div className="relative hover:scale-105 transition-transform duration-300">
            <img 
              src={lockIcon} 
              alt="Contraseña" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5"
            />
            <input 
              type="password" 
              placeholder="Contraseña" 
              className="w-full pl-10 p-3 bg-neutral-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botón estilizado */}
          <button 
            type="submit"
            className="w-full bg-neutral-900 hover:bg-neutral-500 py-3 rounded-lg text-white font-semibold hover:scale-105 transition-transform duration-300"
            onClick={()=>navigate("/")}
          >
            Iniciar Sesión
          </button>
        </div>
        <br />
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-500"></div>
            <h2 className="mx-3 text-gray-400">Or sign in with</h2>
          <div className="flex-grow border-t border-gray-500"></div>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <button className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
            <img src={googleIcon} alt="Google" className="w-8 h-8" />
          </button>
          <button className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
            <img src={facebookIcon} alt="Facebook" className="w-8 h-8" />
          </button>
          <button className="p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform duration-300">
            <img src={xIcon} alt="x" className="w-8 h-8" />
          </button>
        </div>
      </div>  
    </div>
  );
}

export default Container;
