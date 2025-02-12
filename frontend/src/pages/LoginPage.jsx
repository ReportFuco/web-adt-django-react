import React from "react";
import { useNavigate } from "react-router-dom";
import userIcon from "../assets/icons/user-solid.svg";
import lockIcon from "../assets/icons/lock-solid.svg";


function Container() {

  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('.\assets\fondo.webp')] bg-cover bg-fixed opacity-60">
      <div className="absolute top-0 left-0 w-full h-full bg-gray-900/80 z-0"></div>
      <div className="absolute bg-black p-8 rounded-lg shadow-lg text-white w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Iniciar Sesión</h2>

        <div className="space-y-4">
          {/* Input con Icono de Usuario */}
          <div className="relative">
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
          <div className="relative">
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
            className="w-full bg-neutral-900 hover:bg-neutral-500 transition-colors py-3 rounded-lg text-white font-semibold"
            onClick={()=>navigate("/")}
          >
            Iniciar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Container;
