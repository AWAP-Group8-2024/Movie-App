export function formatRuntime(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours} hr ${mins} mins`;
}

export function renderStars(voteAverage) {
  const stars = Math.round(voteAverage / 2);
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}

export const getUserFromSession = () => {
  const userFromSessionStorage = sessionStorage.getItem("user");
  return userFromSessionStorage
    ? JSON.parse(userFromSessionStorage)
    : { id: "", email: "", token: "" };
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { day: '2-digit', month: 'short', year: 'numeric' }; // Format: 18 APR 2024
  return date.toLocaleDateString('en-US', options).toUpperCase();
};
