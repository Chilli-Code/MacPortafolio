// /components/Profile/utils/profileData.js

export const userStats = {
  lastConnection: new Date().toISOString(),
  totalEarnings: 45750,
  monthlyEarnings: 8500,
  tasksCompleted: 247,
  projectsCompleted: 32,
  currentStreak: 12,
  longestStreak: 45,
  totalDaysActive: 156,
  totalHoursWorked: 1842,
  averageRating: 4.9,
  level: 8,
  experience: 3240,
  nextLevelExp: 4000,
  badges: [
    { id: 1, name: "Máster 100", emoji: "🏆", date: "Dic 2024" },
    { id: 2, name: "Velocista", emoji: "⚡", date: "Nov 2024" },
    { id: 3, name: "Constante", emoji: "🔥", date: "Oct 2024" },
    { id: 4, name: "Cliente Feliz", emoji: "⭐", date: "Oct 2024" },
  ],

    profile: {
    name: "Jorge",
    email: "jorge@ejemplo.com",
    role: "Desarrollador Web Full Stack · Freelancer Profesional",
    bio: "¡Hola! 👋 Soy un desarrollador web freelance especializado en crear experiencias digitales increíbles.",
    location: "Barranquilla, Colombia",
    timezone: "GMT-5",
    availability: "Disponible para freelance",
  }
};

export const monthlyData = [
  { month: "Ene", earnings: 3200, hours: 120 },
  { month: "Feb", earnings: 4100, hours: 145 },
  { month: "Mar", earnings: 5200, hours: 168 },
  { month: "Abr", earnings: 4800, hours: 152 },
  { month: "May", earnings: 6200, hours: 180 },
  { month: "Jun", earnings: 7100, hours: 195 },
  { month: "Jul", earnings: 6800, hours: 188 },
  { month: "Ago", earnings: 7500, hours: 200 },
  { month: "Sep", earnings: 8200, hours: 210 },
  { month: "Oct", earnings: 7900, hours: 198 },
  { month: "Nov", earnings: 8500, hours: 215 },
  { month: "Dic", earnings: 8500, hours: 220 },
];

export const projectsByCategory = [
  { category: "Web Development", count: 15, earnings: 18500, color: "bg-blue-500" },
  { category: "UI/UX Design", count: 8, earnings: 12200, color: "bg-purple-500" },
  { category: "Mobile Apps", count: 5, earnings: 9800, color: "bg-green-500" },
  { category: "Consulting", count: 4, earnings: 5250, color: "bg-orange-500" },
];