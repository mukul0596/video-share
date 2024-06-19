export const logout = () => {
  const token = localStorage.getItem("token");
  if (token) {
    localStorage.removeItem("token");
    window.location.reload();
  }
};

export const getUserData = () => {
  const token = localStorage.getItem("token")?.split(".")?.[1];
  let user = {};
  if (token) {
    user = JSON.parse(atob(token));
  }
  return user;
};
