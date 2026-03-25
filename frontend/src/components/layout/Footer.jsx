import RedesSociales from "../common/RedesSociales";
import logo from "../../assets/logo-adt.png";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/10 py-20 px-4 text-white mt-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">
        <div className="flex flex-col gap-6">
          <img src={logo} alt="Adictos al Techno" className="h-10 w-auto object-contain brightness-0 invert" />
          <p className="text-[11px] text-white/40 leading-loose uppercase tracking-[0.28em]">
            Noticias, eventos, entrevistas y cultura underground para quienes viven el techno como lenguaje.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Navegación</h5>
          <ul className="flex flex-col gap-3 text-xs font-bold uppercase tracking-[0.22em] text-white/80">
            <li><a className="hover:text-white transition-colors" href="/noticias">Noticias</a></li>
            <li><a className="hover:text-white transition-colors" href="/entrevistas">Entrevistas</a></li>
            <li><a className="hover:text-white transition-colors" href="/eventos">Eventos</a></li>
            <li><a className="hover:text-white transition-colors" href="/tienda">Tienda</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Social</h5>
          <RedesSociales dark />
          <p className="text-xs text-white/40 uppercase tracking-[0.22em]">Contacto: adictos.al.techno@gmail.com</p>
        </div>

        <div className="flex flex-col gap-6">
          <h5 className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Newsletter</h5>
          <p className="text-xs text-white/40 uppercase tracking-[0.22em]">Sincroniza con el ritmo. Recibe lo mejor en tu correo.</p>
          <div className="flex border-b border-white/40 focus-within:border-white transition-colors">
            <input className="bg-transparent border-none text-xs font-bold uppercase tracking-[0.22em] w-full py-4 focus:ring-0 placeholder:text-white/20 outline-none" placeholder="Email" type="email" />
            <button className="text-white text-xl">→</button>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em]">© {new Date().getFullYear()} Adictos al Techno. All rights reserved.</p>
        <div className="flex gap-8 text-[10px] font-bold uppercase tracking-[0.24em]">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
