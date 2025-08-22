import { createContext, useState } from "react";

export const authContext = createContext();

export const AuthProvider = ({ children }) => {
  const [contextUserName, setContextUserName] = useState(localStorage.getItem("user_name") || "");
  const [contextRole, setContextRole] = useState(localStorage.getItem("role") || "");

  return (
    <authContext.Provider
      value={{
        contextUserName,
        setContextUserName,
        contextRole,
        setContextRole,
      }}
    >
      {children}
    </authContext.Provider>
  );
};
