import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import logo from '../assets/logo-adt.jpg';
import RedesSociales from './RedesSociales';

export default function Header({ title }) {

  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Encabezado Principal */}
      <header className="bg-black text-white p-2 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          
          {/* Logo y título */}
          <div className="flex items-center">
            <img src={logo} alt="Logo" className="h-10 mr-3" onClick={() => navigate("/")}/>
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
          <nav className="hidden md:flex space-x-8">
            <button onClick={() => navigate("/Noticias")} className="p-2 hover:text-neutral-950 hover:bg-amber-300">Noticias</button>
            <button onClick={() => navigate("/Lanzamientos")} className="p-2 hover:text-neutral-950 hover:bg-amber-300">Lanzamientos</button>
            <button onClick={() => navigate("/entrevistas")} className="p-2 hover:text-neutral-950 hover:bg-amber-300">Entrevistas</button>
            <button onClick={() => navigate("/eventos")} className="p-2 hover:text-neutral-950 hover:bg-amber-300">Eventos</button>
            <button onClick={() => navigate("/tienda")} className="p-2 hover:text-neutral-950 hover:bg-amber-300">Tienda</button>
            <button onClick={() => navigate("/contacto")} className="p-2 hover:text-neutral-950 hover:bg-amber-300">Contacto</button>
            <button onClick={() => navigate("/login")} className="p-2 hover:text-neutral-950 hover:bg-amber-300">Iniciar sesión</button>
        </nav>
        </div>

        {/* Menú desplegable en móviles */}
        <div className={`${isOpen ? "block" : "hidden"} md:hidden bg-neutral-900 p-4`}>
          <button onClick={() => navigate("/Noticias")} className="block py-1 px-4 hover:bg-neutral-950">Noticias</button>
          <button onClick={() => navigate("/Lanzamientos")} className="block py-1 px-4 hover:bg-neutral-950">Lanzamientos</button>
          <button onClick={() => navigate("/entrevistas")} className="block py-1 px-4 hover:bg-neutral-950">Entrevistas</button>
          <button onClick={() => navigate("/eventos")} className="block py-1 px-4 hover:bg-neutral-950">Eventos</button>
          <button onClick={() => navigate("/tienda")} className="block py-1 px-4 hover:bg-neutral-950">Tienda</button>
          <button onClick={() => navigate("/contacto")} className="block py-1 px-4 hover:bg-neutral-950">Contacto</button>
          <button onClick={() => navigate("/login")} className="block py-1 px-4 hover:bg-neutral-950">Iniciar sesión</button>
        </div>
      </header>

      {/* Barra de Novedades */}
      <div className="bg-neutral-950 text-white text-sm p-0 flex justify-between items-center shadow-md">
        <div className="flex-1 overflow-hidden">
          <marquee behavior="scroll" direction="left" className="text-gray-300">
            🔥 Últimas novedades: Nuevo evento de música Techno en Santiago | Descuento del 20% en productos exclusivos | 🎶 Nuevas playlists disponibles | El Fuco estuvo probando esta wea.
          </marquee>
        </div>
        
        <div className="flex space-x-3 items-center bg-neutral-900 px-4 py-2">
          <RedesSociales />
        </div>
      </div>

    </>
  );
}

