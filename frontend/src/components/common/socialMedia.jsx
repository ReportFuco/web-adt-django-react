import { motion } from "framer-motion";
import instagram from "../../assets/icons/instagram-brands-solid.svg";
import whatsapp from "../../assets/icons/whatsapp-icon.svg";
import spotifyicon from "../../assets/icons/spotify-brands-solid.svg";
import tiktok from "../../assets/icons/tiktok-brands-solid.svg";
import { NumberTicker } from "@/components/magicui/number-ticker";

const socialMediaData = [
  { id: 1, icon: instagram, alt: "Instagram", count: 134701, url: "https://www.instagram.com/adictos_al_techno/" },
  { id: 2, icon: whatsapp, alt: "Comunidad WhatsApp", count: 668, url: "https://chat.whatsapp.com/EZkSGVq4BrpLc7SCxIHjNz" },
  { id: 3, icon: spotifyicon, alt: "Playlist Spotify", count: 995, url: "https://open.spotify.com/playlist/4uDeR4NrQHknGI4XMVEwRH?fbclid=PAZXh0bgNhZW0CMTEAAafpoGV8xavIV9hbDs4y4lIT6nN1Iou6NcS8iyq7RYwzT3dS1rTroQOZ8atcjg_aem_KXbo3FsofuRP-qVDBMXNHw&nd=1&dlsi=b2dfcb3b265a4eed" },
  { id: 4, icon: tiktok, alt: "TikTok", count: 104, url: "https://www.tiktok.com/@adictos.al.techno?_t=ZM-8vv8jszOOKz&_r=1" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.14 } },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.45 } },
};

const hoverVariants = {
  hover: { y: -5, scale: 1.02, transition: { duration: 0.25, ease: "easeOut" } },
};

function Socialmedia() {
  return (
    <section className="px-4 my-10 text-center text-neutral-900">
      <motion.div
        className="flex flex-col md:flex-row justify-center gap-5 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {socialMediaData.map((social) => (
          <motion.a
            key={social.id}
            className="flex flex-col items-center gap-4 rounded-[24px] border border-black/8 p-8 w-full md:w-64 lg:w-72 bg-white/88 shadow-sm backdrop-blur-sm"
            variants={itemVariants}
            whileHover="hover"
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <motion.div variants={hoverVariants} className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 border border-black/6">
              <img src={social.icon} alt={social.alt} className="h-7 w-7 object-contain opacity-85" />
            </motion.div>
            <motion.p className="font-bold text-neutral-900" variants={hoverVariants}>
              <NumberTicker
                value={social.count}
                className="whitespace-pre-wrap text-4xl font-semibold tracking-tighter text-neutral-900"
              />
            </motion.p>
            <motion.p className="text-sm text-neutral-500 uppercase tracking-[0.18em]" variants={hoverVariants}>
              {social.alt}
            </motion.p>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}

export default Socialmedia;
