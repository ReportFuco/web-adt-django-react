import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import logo from "../assets/logo-adt.jpg";
import RedesSociales from "./RedesSociales";
import Marquee from "react-fast-marquee";

export default function Header({ title }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Noticias", path: "/Noticias" },
    { label: "Lanzamientos", path: "/Lanzamientos" },
    { label: "Entrevistas", path: "/entrevistas" },
    { label: "Eventos", path: "/eventos" },
    { label: "Tienda", path: "/tienda" },
    { label: "Contacto", path: "/contacto" },
    { label: "Iniciar sesión", path: "/login" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-black text-white p-2 shadow-md z-50 h-16">
        <div className="container mx-auto flex justify-between items-center h-full px-4">
          <div className="flex items-center">
            <img
              src={logo}
              alt="Logo"
              className="h-10 mr-3 cursor-pointer"
              onClick={() => navigate("/")}
            />
            <h1 className="text-xl font-bold hidden md:block">{title}</h1>
          </div>

          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${
                isOpen ? "rotate-90" : "rotate-0"
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Navegación en pantallas grandes */}
          <nav className="hidden md:flex space-x-6">
            {menuItems.map((item, index) => (
              <a
                key={index}
                onClick={() => navigate(item.path)}
                className="cursor-pointer p-2 hover:text-neutral-950 hover:bg-amber-300 font-bold transition duration-200 rounded"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Menú desplegable en móviles (animado con transición) */}
        <div
          className={`absolute top-16 left-0 w-full bg-neutral-900 md:hidden overflow-hidden transition-all duration-300 ${
            isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <ul className="flex flex-col space-y-2 py-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  onClick={() => {
                    navigate(item.path);
                    setIsOpen(false);
                  }}
                  className="block py-2 px-4 text-white hover:bg-neutral-950 transition duration-200 rounded cursor-pointer"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </header>

      <div className="fixed top-16 left-0 w-full bg-neutral-800 text-white text-sm flex justify-between items-center shadow-md z-40">
        <div className="flex-1 overflow-hidden space-x-3">
          <Marquee speed={75} className="bg-neutral-800 text-white py-1.5">
            🔥 Últimas novedades: Nuevo evento de música Techno en Santiago | Descuento del 20% en productos exclusivos | 🎶 Nuevas playlists disponibles | El Fuco estuvo probando esta wea.
          </Marquee>
        </div>

        <div className="flex space-x-3 items-center bg-neutral-900 px-4 py-1.5">
          <RedesSociales />
        </div>
      </div>

      <div className="mt-28"></div>
    </>
  );
}
