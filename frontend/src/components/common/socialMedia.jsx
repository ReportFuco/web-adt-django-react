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
    count: 125121,
    url: "https://www.instagram.com/adictos_al_techno/",
  },
  {
    id: 2,
    icon: whatsapp,
    alt: "Comunidad WhatsApp",
    count: 527,
    url: "https://chat.whatsapp.com/EZkSGVq4BrpLc7SCxIHjNz",
  },
  {
    id: 3,
    icon: spotifyicon,
    alt: "Playlist Spotify",
    count: 2003,
    url: "https://open.spotify.com/playlist/4uDeR4NrQHknGI4XMVEwRH?fbclid=PAZXh0bgNhZW0CMTEAAafpoGV8xavIV9hbDs4y4lIT6nN1Iou6NcS8iyq7RYwzT3dS1rTroQOZ8atcjg_aem_KXbo3FsofuRP-qVDBMXNHw&nd=1&dlsi=b2dfcb3b265a4eed",
  },
  {
    id: 4,
    icon: tiktok,
    alt: "tiktok",
    count: 100,
    url: "https://www.tiktok.com/@adictos.al.techno?_t=ZM-8vv8jszOOKz&_r=1",
  },
];

// Animaciones
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

const hoverVariants = {
  hover: {
    y: -5,
    scale: 1.03,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

function Socialmedia() {
  return (
    <section className="bg-black px-4 m-4 my-10 text-white text-center">
      <motion.div
        className="flex flex-col md:flex-row justify-center gap-6 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {socialMediaData.map((social) => (
          <motion.a
            key={social.id}
            className={`flex flex-col items-center gap-4 rounded-xl p-8 w-full md:w-64 lg:w-80 bg-neutral-900 shadow-lg`}
            variants={itemVariants}
            whileHover="hover"
            href={social.url}
            target="_blank"
          >
            <motion.div variants={hoverVariants}>
              <img
                src={social.icon}
                alt={social.alt}
                className="h-12 w-12 object-contain"
              />
            </motion.div>
            <motion.p className="font-bold" variants={hoverVariants}>
              <NumberTicker
                value={social.count}
                className="whitespace-pre-wrap text-4xl font-medium tracking-tighter dark:text-white"
              />
            </motion.p>
            <motion.p className="text-sm opacity-80" variants={hoverVariants}>
              {social.alt}
            </motion.p>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}

export default Socialmedia;
