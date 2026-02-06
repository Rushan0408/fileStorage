const isBrowser = () => typeof window !== "undefined";

export const getToken = (): string | null => {
  if (!isBrowser()) return null;
  return localStorage.getItem("token");
};

export const setToken = (token: string): void => {
  if (!isBrowser()) return;
  localStorage.setItem("token", token);
};

export const removeToken = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem("token");
};

export const getUser = (): any => {
  if (!isBrowser()) return null;

  const user = localStorage.getItem("user");
  if (!user || user === "undefined") return null;

  try {
    return JSON.parse(user);
  } catch {
    return null;
  }
};

export const setUser = (user: any): void => {
  if (!isBrowser()) return;
  localStorage.setItem("user", JSON.stringify(user));
};

export const removeUser = (): void => {
  if (!isBrowser()) return;
  localStorage.removeItem("user");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = (): void => {
  removeToken();
  removeUser();
};