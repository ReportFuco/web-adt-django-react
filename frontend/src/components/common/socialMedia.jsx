import { motion } from "framer-motion";
import instagram from "../../assets/icons/instagram-brands-solid.svg";
import xicon from "../../assets/icons/x-twitter-brands-solid.svg";
import spotifyicon from "../../assets/icons/spotify-brands-solid.svg";
import tiktok from "../../assets/icons/tiktok-brands-solid.svg"

const socialMediaData = [
  {
    id: 1,
    icon: instagram,
    alt: "Instagram",
    count: "115.826",
  },
  {
    id: 2,
    icon: xicon,
    alt: "Twitter/X",
    count: "2.003",
  },
  {
    id: 3,
    icon: spotifyicon,
    alt: "Spotify",
    count: "2.003",
  },
  {
    id: 4,
    icon:tiktok,
    alt: "tiktok",
    count: "100"
  }
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
    <section className="bg-black py-20 px-4 mt-4 border-y-4 border-neutral-700 text-white text-center">
      <motion.div
        className="flex flex-col md:flex-row justify-center gap-6 max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {socialMediaData.map((social) => (
          <motion.div
            key={social.id}
            className={`flex flex-col items-center gap-5 rounded-xl p-8 w-full md:w-64 lg:w-80 bg-neutral-900 shadow-lg`}
            variants={itemVariants}
            whileHover="hover"
          >
            <motion.div variants={hoverVariants}>
              <img 
                src={social.icon} 
                alt={social.alt} 
                className="h-12 w-12 object-contain" 
              />
            </motion.div>
            <motion.p 
              className="text-3xl font-bold"
              variants={hoverVariants}
            >
              {social.count}
            </motion.p>
            <motion.p 
              className="text-sm opacity-80"
              variants={hoverVariants}
            >
              {social.alt} followers
            </motion.p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

export default Socialmedia;