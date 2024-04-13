import React, { createContext, useContext, useState, useEffect } from "react";
import { firebase_auth } from "../database/firebaseconfig";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userEmail, setUserEmail] = useState(null);

  // Add an effect here to update the userEmail based on Firebase Auth state
  useEffect(() => {
    const unsubscribe = firebase_auth.onAuthStateChanged((user) => {
      if (user) {
        setUserEmail(user.email); // Set the email in context
      } else {
        setUserEmail(null); // Clear the email in context
      }
    });

    return unsubscribe; // Clean up the subscription
  }, []);

  return (
    <UserContext.Provider value={{ userEmail, setUserEmail }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
