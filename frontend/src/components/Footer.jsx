import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#111] text-white py-8 mt-0">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">
        {/* Redes Sociales y Contacto */}
        <div>
          <h3 className="bg-gradient-to-r from-purple-500 to-pink-500 text-transparent bg-clip-text">Síguenos</h3>
          <div className="flex space-x-4 mt-3">
            <a href="https://tiktok.com" className="hover:text-purple-300 transition">TikTok</a>
            <a href="https://instagram.com" className="hover:text-purple-300 transition">Instagram</a>
            <a href="https://facebook.com" className="hover:text-purple-300 transition">Facebook</a>
          </div>
          <p className="mt-4 text-gray-400">Contacto: contacto@techno.com</p>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-8 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} Techno. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
