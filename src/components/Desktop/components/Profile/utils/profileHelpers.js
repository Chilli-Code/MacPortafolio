// /components/Profile/utils/profileHelpers.js

export const formatLastConnection = (date) => {
  const now = new Date();
  const last = new Date(date);
  const diffMs = now - last;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return "Ahora";
  if (diffMins < 60) return `Hace ${diffMins} min`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `Hace ${diffHours}h`;
  const diffDays = Math.floor(diffHours / 24);
  return `Hace ${diffDays} días`;
};

export const getActivityColor = (level) => {
  const colors = [
    'bg-gray-100 dark:bg-gray-800',
    'bg-green-100 dark:bg-green-900/30',
    'bg-green-300 dark:bg-green-700/50',
    'bg-green-500 dark:bg-green-600',
    'bg-green-700 dark:bg-green-500'
  ];
  return colors[level] || colors[0];
};

export const generateActivityData = () => {
  const data = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setMonth(startDate.getMonth() - 12);

  for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
    const intensity = Math.random() > 0.3 ? Math.floor(Math.random() * 5) : 0;
    data.push({
      date: new Date(d).toISOString().split('T')[0],
      count: intensity * 3,
      level: intensity
    });
  }
  return data;
};

export const getWeeksData = (activityData) => {
  const weeks = [];
  let currentWeek = [];
  
  activityData.forEach((day) => {
    const date = new Date(day.date);
    const dayOfWeek = date.getDay();
    
    if (dayOfWeek === 0 && currentWeek.length > 0) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
    currentWeek.push(day);
  });
  
  if (currentWeek.length > 0) weeks.push(currentWeek);
  return weeks;
};