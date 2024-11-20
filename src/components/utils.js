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
