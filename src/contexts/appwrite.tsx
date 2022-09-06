import { Client } from "appwrite";
import React from "react";

const AppwriteContext = React.createContext<Client | null>(null);

export const AppwriteProvider = ({
  value,
  children,
}: {
  value: Client;
  children: JSX.Element;
}): JSX.Element => {
  return (
    <AppwriteContext.Provider value={value}>
      {children}
    </AppwriteContext.Provider>
  );
};

export const useAppwrite = (): Client | null => {
  const context = React.useContext(AppwriteContext);
  if (context === undefined) {
    throw new Error("useAppwrite must be used within a AppwriteProvider");
  }
  return context;
};
