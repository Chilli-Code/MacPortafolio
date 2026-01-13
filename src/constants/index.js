
const navLinks = [
  {
    id: 1,
    name: "Proyectos",
    type: "finder",
  },
  {
    id: 3,
    name: "Contacto",
    type: "contact",
  },
  {
    id: 4,
    name: "Resume",
    type: "resume",
  },
];

const navIcons = [
  {
    id: 1,
    img: "/icons/wifi.svg",
  },
  {
    id: 2,
    // img: "/icons/search.svg",
    img: "/icons/settings-mac.svg",
  },
  {
    id: 3,
    img: "/icons/user.svg",
  },
  {
    id: 4,
    img: "/icons/mode.svg",
  },
];

const dockApps = [
  {
    id: "finder",
    name: "Archivos", // was "Finder"
    icon: "finder.webp",
    canOpen: true,
  },
  {
    id: "safari",
    name: "Safari", // was "Safari"
    icon: "safari.webp",
    canOpen: true,
  },
  {
    id: "photos",
    name: "Galeria", // was "Photos"
    icon: "photos.webp",
    canOpen: true,
  },
  {
    id: "contact",
    name: "Contacto", // or "Get in touch"
    icon: "contact.webp",
    canOpen: true,
  },
  {
    id: "terminal",
    name: "Terminal", // was "Terminal"
    icon: "terminal.webp",
    canOpen: true,
  },
  {
    id: "game",
    name: "game",
    icon: "game.svg",
    canOpen: true,
  },
];

const dockAppsMobile = [
  {
    id: "finder",
    name: "Archivos", // was "Finder"
    icon: "folder.webp",
    canOpen: true,
  },
  {
    id: "safari",
    name: "Navegador", // was "Safari"
    icon: "safari.webp",
    canOpen: true,
  },
  {
    id: "photos",
    name: "Galeria", // was "Photos"
    icon: "photos.webp",
    canOpen: true,
  },
  {
    id: "contact",
    name: "Contacto", // or "Get in touch"
    icon: "contact.webp",
    canOpen: true,
  },
  {
    id: "terminal",
    name: "Terminal", // was "Terminal"
    icon: "terminal.webp",
    canOpen: true,
  },
];

const screenApps = [
    {
    id: "finder",
    name: "Archivos", // was "Finder"
    icon: "folder.webp",
    canOpen: true,
  },
  {
    id: "settings",
    name: "Configuracion", // was "Safari"
    icon: "settingMobile.webp",
    canOpen: true,
  },
  {
    id: "mail",
    name: "Correo", // was "Photos"
    icon: "mail.webp",
    canOpen: true,
  },
  {
    id: "messages",
    name: "Mensajes", // or "Get in touch"
    icon: "messages.svg",
    canOpen: true,
  },
  {
    id: "terminal",
    name: "Skills", // was "Terminal"
    icon: "terminal.webp",
    canOpen: true,
  },

];

const blogPosts = [
  {
    id: 1,
    date: "Sep 2, 2025",
    title:
      "Cómo creé mi portafolio de desarrollo al estilo macOS con React + Tailwind",
    image: "/images/blog1.png",
    link: "https://github.com/chilli-Code",
  },
  {
    id: 2,
    date: "Aug 28, 2025",
    title: "Cómo organizo mis proyectos para mantener la cordura y la rapidez",
    image: "/images/blog2.png",
    link: "https://github.com/chilli-Code",
  },
  {
    id: 3,
    date: "Aug 15, 2025",
    title: "Pequeños detalles de UX que marcan una gran diferencia (y cómo los implementé)",
    image: "/images/blog3.png",
    link: "https://github.com/chilli-Code",
  },
];

const techStack = [
  {
    category: "Frontend",
    items: ["React.js", "Next.js", "TypeScript"],
  },
  {
    category: "Mobile",
    items: ["React Native", "Expo"],
  },
  {
    category: "Styling",
    items: ["Tailwind CSS", "Sass", "CSS"],
  },
  {
    category: "Backend",
    items: ["Node.js", "Express", "NestJS", "Hono"],
  },
  {
    category: "Database",
    items: ["MongoDB", "PostgreSQL"],
  },
  {
    category: "Dev Tools",
    items: ["Git", "GitHub", "Docker"],
  },
];

const socials = [
  {
    id: 1,
    text: "Github",
    icon: "/icons/github.svg",
    bg: "#f4656b",
    link: "https://github.com/chilli-Code/",
  },
  {
    id: 2,
    text: "Platform",
    icon: "/icons/atom.svg",
    bg: "#4bcb63",
    link: "https://github.com/chilli-Code/",
  },
  {
    id: 3,
    text: "Twitter/X",
    icon: "/icons/twitter.svg",
    bg: "#ff866b",
    link: "https://github.com/chilli-Code/",
  },
  {
    id: 4,
    text: "LinkedIn",
    icon: "/icons/linkedin.svg",
    bg: "#05b6f6",
    link: "https://github.com/chilli-Codel",
  },
];

const profileLinks = [
  
  {
    id: 1,
    icon: "/icons/stroked.svg",
    title: "General",
  },
  {
    id: 2,
    icon: "/icons/chart.svg",
    title: "Estadísticas",
  },
  {
    id: 3,
    icon: "/icons/trophy.svg",
    title: "Logros",
  },
  {
    id: 4,
    icon: "/icons/clock.svg",
    title: "Actividad",
  },
  {
    id: 5,
    icon: "/icons/dollar.svg",
    title: "Finanzas",
  },
    {
    id: 6,
    icon: "/icons/briefcase.svg",
    title: "Proyectos",
  },
];


const photosLinks = [
  {
    id: 1,
    icon: "/icons/gicon1.svg",
    title: "Biblioteca",
  },
  {
    id: 2,
    icon: "/icons/gicon2.svg",
    title: "Recuerdos",
  },
  {
    id: 3,
    icon: "/icons/file.svg",
    title: "Lugares",
  },
  {
    id: 4,
    icon: "/icons/gicon4.svg",
    title: "Gente",
  },
  {
    id: 5,
    icon: "/icons/gicon5.svg",
    title: "Favoritos",
  },
];



const settingsLinks = [
  {
    id: 1,
    icon: "/icons/appearance.svg",
    title: "appearance", // ⭐ Key de traducción
  },
  {
    id: 2,
    icon: "/icons/notifications.svg",
    title: "notifications_settings", // ⭐ Key de traducción
  },
  {
    id: 3,
    icon: "/icons/permissions.svg",
    title: "permissions", // ⭐ Key de traducción
  },
  {
    id: 4,
    icon: "/icons/language.svg",
    title: "language", // ⭐ Key de traducción
  },
  {
    id: 5,
    icon: "/icons/advanced.svg",
    title: "advanced", // ⭐ Key de traducción (nueva)
  },
];



const gallery = [
  {
    id: 1,
    img: "/images/gal1.png",
  },
  {
    id: 2,
    img: "/images/gal2.png",
  },
  {
    id: 3,
    img: "/images/gal3.png",
  },
  {
    id: 4,
    img: "/images/gal4.png",
  },
];

const usersChat = [
    {
        id: 1,
        name: "Juan Pérez",
        avatar: "https://randomuser.me/api/portraits/men/1.jpg", // Foto de usuario
        role: "Diseñador UI/UX", // Rol
    },
    {
        id: 2,
        name: "María González",
        avatar: "https://randomuser.me/api/portraits/women/2.jpg",
        role: "Backend",
    },
    {
        id: 3,
        name: "Carlos Martínez",
        avatar: "https://randomuser.me/api/portraits/men/3.jpg",
        role: "Frontend",
    },
    {
        id: 4,
        name: "Ana López",
        avatar: "https://randomuser.me/api/portraits/women/4.jpg",
        role: "Admin",
    },
    // Agregar más usuarios si es necesario
];



export {
  navLinks,
  navIcons,
  dockApps,
  blogPosts,
  techStack,
  socials,
  photosLinks,
  settingsLinks,
  gallery,
  profileLinks,
  usersChat,
  dockAppsMobile,
  screenApps,
};

const WORK_LOCATION = {
  id: 1,
  type: "work",
  name: "Trabajo",
  icon: "/icons/work.svg",
  kind: "folder",
  children: [
    // ▶ Project 1
    {
      id: 5,
      name: "Nike Ecommerce Website Application",
      icon: "/images/folder.webp",
      kind: "folder",
      position: "top-10 left-5", // icon position inside Finder
      windowPosition: "top-[5vh] right-10", // optional: Finder window position
      children: [
        {
          id: 1,
          name: "Nike Project.txt",
          icon: "/images/txt.webp",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "The Nike eCommerce website is a sleek and modern platform designed for shopping the latest Nike collections.",
            "Instead of a simple online store, it delivers an immersive experience with bold visuals, interactive product displays, and smooth navigation.",
            "Think of it like walking into a flagship Nike store—but right from your phone or laptop.",
            "It's built with Next.js and Tailwind, ensuring fast performance, responsive design, and a clean, premium look.",
          ],
        },
        {
          id: 2,
          name: "nike.com",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://youtu.be/fZdTYswuZjU?si=Awjl-pIst9e09_UU",
          position: "top-10 right-20",
        },
        {
          id: 4,
          name: "nike.png",
          icon: "/images/image.webp",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/project-1.png",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.webp",
          kind: "file",
          fileType: "fig",
          href: "https://google.com",
          position: "top-60 right-20",
        },
      ],
    },

    // ▶ Project 2
    {
      id: 6,
      name: "AI Resume Analyzer",
      icon: "/images/folder.webp",
      kind: "folder",
      position: "top-52 right-80",
      windowPosition: "top-[30vh] left-7",
      children: [
        {
          id: 1,
          name: "AI Resume Analyzer Project.txt",
          icon: "/images/txt.webp",
          kind: "file",
          fileType: "txt",
          position: "top-5 right-10",
          description: [
            "AI Resume Analyzer is a smart tool that helps you perfect your resume with instant feedback.",
            "Instead of guessing what recruiters want, you get AI-powered insights on keywords, formatting, and overall impact.",
            "Think of it like having a career coach—pointing out strengths, fixing weaknesses, and boosting your chances of landing interviews.",
            "It's built with Next.js and Tailwind, so it runs fast, looks professional, and works seamlessly on any device.",
          ],
        },
        {
          id: 2,
          name: "ai-resume-analyzer.com",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://youtu.be/iYOz165wGkQ?si=R1hs8Legl200m0Cl",
          position: "top-20 left-20",
        },
        {
          id: 4,
          name: "ai-resume-analyzer.png",
          icon: "/images/image.webp",
          kind: "file",
          fileType: "img",
          position: "top-52 left-80",
          imageUrl: "/images/project-2.png",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.webp",
          kind: "file",
          fileType: "fig",
          href: "https://google.com",
          position: "top-60 left-5",
        },
      ],
    },

    // ▶ Project 3
    {
      id: 7,
      name: "Food Delivery App",
      icon: "/images/folder.webp",
      kind: "folder",
      position: "top-10 left-80",
      windowPosition: "top-[33vh] right-7",
      children: [
        {
          id: 1,
          name: "Food Delivery App Project.txt",
          icon: "/images/txt.webp",
          kind: "file",
          fileType: "txt",
          position: "top-5 left-10",
          description: [
            "Our Food Delivery App is a fast and convenient way to order meals from your favorite restaurants.",
            "Instead of making calls or waiting in line, you can browse menus, customize orders, and track deliveries in real time.",
            "Think of it like having your favorite restaurants in your pocket—ready to deliver anytime, anywhere.",
            "It’s built with React Native, so it works smoothly on both iOS and Android with a clean, modern design.",
          ],
        },
        {
          id: 2,
          name: "food-delivery-app.com",
          icon: "/images/safari.webp",
          kind: "file",
          fileType: "url",
          href: "https://youtu.be/LKrX390fJMw?si=cExkuVhf2DTV9G2-",
          position: "top-10 right-20",
        },
        {
          id: 4,
          name: "food-delivery-app.png",
          icon: "/images/image.webp",
          kind: "file",
          fileType: "img",
          position: "top-52 right-80",
          imageUrl: "/images/project-3.png",
        },
        {
          id: 5,
          name: "Design.fig",
          icon: "/images/plain.webp",
          kind: "file",
          fileType: "fig",
          href: "https://google.com",
          position: "top-60 right-20",
        },
      ],
    },
  ],
};




const ABOUT_LOCATION = {
  id: 2,
  type: "about",
  name: "Acerca de mí",
  icon: "/icons/info.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "me.png",
      icon: "/images/image.webp",
      kind: "file",
      fileType: "img",
      position: "top-10 left-5",
      imageUrl: "/images/jorge-3.jpg",
    },
    {
      id: 2,
      name: "casual-me.png",
      icon: "/images/image.webp",
      kind: "file",
      fileType: "img",
      position: "top-28 right-72",
      imageUrl: "/images/jorge-2.jpg",
    },
    {
      id: 3,
      name: "conference-me.jpg",
      icon: "/images/image.webp",
      kind: "file",
      fileType: "img",
      position: "top-52 left-80",
      imageUrl: "/images/conference-me.jpg",
    },
    {
      id: 4,
      name: "about-me.txt",
      icon: "/images/txt.webp",
      kind: "file",
      fileType: "txt",
      position: "top-60 left-5",
      subtitle: "Conoce al desarrollador detrás del código",
      image: "/images/Avatar.png",
      description: [
        "¡Hola! Soy Jorge 👋, un desarrollador web al que le gusta crear sitios web elegantes e interactivos que realmente funcionan bien.",
        "Me especializo en JavaScript, React y Next.js, y me encanta hacer que las cosas funcionen con fluidez, rapidez y un toque de encanto.",
        "Me gusta mucho la interfaz de usuario limpia, la buena experiencia de usuario y escribir código que no requiera un equipo de búsqueda para depurarlo.",
        "Fuera del trabajo de desarrollo, me encontrarás retocando diseños a las 2 de la madrugada, bebiendo café carísimo o comprando por impulso gadgets que me he convencido a mí mismo de que necesito 😅.",
      ],
    },
  ],
};

const RESUME_LOCATION = {
  id: 3,
  type: "resume",
  name: "Resume",
  icon: "/icons/file.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "Resume.pdf",
      icon: "/images/pdf.webp",
      kind: "file",
      fileType: "pdf",
      // you can add `href` if you want to open a hosted resume
      // href: "/your/resume/path.pdf",
    },
  ],
};

const TRASH_LOCATION = {
  id: 4,
  type: "trash",
  name: "Papelera",
  icon: "/icons/trash.svg",
  kind: "folder",
  children: [
    {
      id: 1,
      name: "trash1.png",
      icon: "/images/image.webp",
      kind: "file",
      fileType: "img",
      position: "top-10 left-10",
      imageUrl: "/images/trash-1.png",
    },
    {
      id: 2,
      name: "trash2.png",
      icon: "/images/image.webp",
      kind: "file",
      fileType: "img",
      position: "top-40 left-80",
      imageUrl: "/images/trash-2.png",
    },
  ],
};

// notifications data





export const locations = {
  work: WORK_LOCATION,
  about: ABOUT_LOCATION,
  resume: RESUME_LOCATION,
  trash: TRASH_LOCATION,
};

// src/constants/index.js
// src/constants/index.js
const INITIAL_Z_INDEX = 1000;

const WINDOW_CONFIG = {
  finder: { isOpen: false, isMinimized: false, zIndex: INITIAL_Z_INDEX, data: null },
  contact: { isOpen: false, isMinimized: false, zIndex: INITIAL_Z_INDEX, data: null },
  resume: { isOpen: false, isMinimized: false, zIndex: INITIAL_Z_INDEX, data: null },
  safari: { isOpen: false, isMinimized: false, zIndex: INITIAL_Z_INDEX, data: null },
  photos: { isOpen: false, isMinimized: false, zIndex: INITIAL_Z_INDEX, data: null },
  terminal: { isOpen: false, isMinimized: false, zIndex: INITIAL_Z_INDEX, data: null },
  txtfile: { isOpen: false, isMinimized: false, zIndex: INITIAL_Z_INDEX, data: null },
  imgfile: { isOpen: false, isMinimized: false, zIndex: INITIAL_Z_INDEX, data: null },
  modalMode: { isOpen: false, isMinimized: false, zIndex: INITIAL_Z_INDEX, data: null },
  profile: { isOpen: false, isMinimized: false, zIndex: INITIAL_Z_INDEX, data: null },
  settings: { isOpen: false, isMinimized: false, zIndex: INITIAL_Z_INDEX, data: null },
  gmail: { isOpen: false, isMinimized: false, zIndex: INITIAL_Z_INDEX, data: null },
  game: { 
    isOpen: false, 
    isMinimized: false,
    zIndex: 9999,
    data: null,
    fullscreen: true
  },
};

export { INITIAL_Z_INDEX, WINDOW_CONFIG };