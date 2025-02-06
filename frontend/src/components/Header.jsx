import React, { useState } from 'react';
import logo from '../assets/logo-adt.jpg';

export default function Header({ title }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Encabezado Principal */}
      <header className="bg-gray-800 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          
          {/* Logo y título */}
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 mr-3" />
            <h1 className="text-xl font-bold">{title}</h1>
          </div>

          {/* Botón de menú hamburguesa en móviles */}
          <button 
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            {/* Icono de menú (tres barras) */}
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>

          {/* Navegación en pantallas grandes */}
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-gray-300">Eventos</a>
            <a href="#" className="hover:text-gray-300">Productos</a>
            <a href="#" className="hover:text-gray-300">Contacto</a>
            <a href="#" className="hover:text-gray-300">Iniciar sesión</a>
          </nav>
        </div>

        {/* Menú desplegable en móviles */}
        <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-gray-800 p-4`}>
          <a href="#" className="block py-2 px-4 hover:bg-gray-700">Inicio</a>
          <a href="#" className="block py-2 px-4 hover:bg-gray-700">Noticias</a>
          <a href="#" className="block py-2 px-4 hover:bg-gray-700">Enventos</a>
          <a href="#" className="block py-2 px-4 hover:bg-gray-700">Entrevistas</a>
          <a href="#" className="block py-2 px-4 hover:bg-gray-700">Iniciar sesión</a>
        </div>
      </header>

      {/* Barra de Novedades */}
      <div className="bg-amber-300 text-black text-sm p-0.5 overflow-hidden">
        <marquee behavior="scroll" direction="left">
          🔥 Últimas novedades: Nuevo evento de música Techno en Santiago | Descuento del 20% en productos exclusivos | 🎶 Nuevas playlists disponibles.
        </marquee>
      </div>
      <hr className="border-t-3 border-gray-700 my-3 mx-auto w-20/20 opacity-50" />
    </>
  );
}

