import React from "react";
import RedesSociales from "./RedesSociales";

const Footer = () => {
  return (
    <footer className="bg-[#111] text-white py-8 mt-0">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        {/* Redes Sociales y Contacto */}
        <div>
          <h3 className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">Síguenos</h3>
              <RedesSociales classNameDiseño="mt-3" />
          <p className="mt-4 text-gray-400">Contacto: contacto@techno.com</p>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Adictos al Techno. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
