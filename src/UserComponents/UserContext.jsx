import { createContext } from "react";

export const initialUserState = { id: "", email: "", token: "", password: "" };

export const UserContext = createContext({
  user: initialUserState,
  setUser: () => {},
});
