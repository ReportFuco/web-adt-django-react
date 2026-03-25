import { motion } from "framer-motion";
import instagram from "../../assets/icons/instagram-brands-solid.svg";
import whatsapp from "../../assets/icons/whatsapp-icon.svg";
import spotifyicon from "../../assets/icons/spotify-brands-solid.svg";
import tiktok from "../../assets/icons/tiktok-brands-solid.svg";
import { NumberTicker } from "@/components/magicui/number-ticker";

const socialMediaData = [
  {
    id: 1,
    icon: instagram,
    alt: "Instagram",
    count: 134701,
    url: "https://www.instagram.com/adictos_al_techno/",
  },
  {
    id: 2,
    icon: whatsapp,
    alt: "Comunidad WhatsApp",
    count: 668,
    url: "https://chat.whatsapp.com/EZkSGVq4BrpLc7SCxIHjNz",
  },
  {
    id: 3,
    icon: spotifyicon,
    alt: "Playlist Spotify",
    count: 995,
    url: "https://open.spotify.com/playlist/4uDeR4NrQHknGI4XMVEwRH?fbclid=PAZXh0bgNhZW0CMTEAAafpoGV8xavIV9hbDs4y4lIT6nN1Iou6NcS8iyq7RYwzT3dS1rTroQOZ8atcjg_aem_KXbo3FsofuRP-qVDBMXNHw&nd=1&dlsi=b2dfcb3b265a4eed",
  },
  {
    id: 4,
    icon: tiktok,
    alt: "TikTok",
    count: 104,
    url: "https://www.tiktok.com/@adictos.al.techno?_t=ZM-8vv8jszOOKz&_r=1",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants = {
  hidden: { y: 18, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.4 } },
};

function Socialmedia() {
  return (
    <section className="px-4 my-14" style={{ color: "var(--text)" }}>
      <div className="max-w-7xl mx-auto mb-8">
        <div className="section-title">
          <div>
            <h2 className="section-title-heading">Comunidad</h2>
            <p className="section-title-kicker">Reach / social / audience</p>
          </div>
        </div>
      </div>

      <motion.div
        className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {socialMediaData.map((social) => (
          <motion.a
            key={social.id}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            whileHover={{ y: -4, backgroundColor: "rgba(255,255,255,0.03)", transition: { duration: 0.2 } }}
            className="group min-h-[270px] theme-panel-strong p-8 flex flex-col items-center justify-center text-center"
          >
            <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-full theme-button-secondary bg-white/5">
              <img
                src={social.icon}
                alt={social.alt}
                className="h-7 w-7 object-contain brightness-0 invert opacity-85 group-hover:opacity-100"
              />
            </div>

            <div className="mb-5" style={{ color: "var(--text)" }}>
              <NumberTicker
                value={social.count}
                className="whitespace-pre-wrap text-4xl md:text-5xl font-bold tracking-tight"
              />
            </div>

            <p className="text-[11px] md:text-xs theme-text-muted uppercase tracking-[0.24em] font-bold leading-relaxed">
              {social.alt}
            </p>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}

export default Socialmedia;
