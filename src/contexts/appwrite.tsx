import { Appwrite } from "appwrite";
import React from "react";

const AppwriteContext = React.createContext<Appwrite | null>(null);

export const AppwriteProvider = ({
  value,
  children,
}: {
  value: Appwrite;
  children: JSX.Element;
}): JSX.Element => {
  return (
    <AppwriteContext.Provider value={value}>
      {children}
    </AppwriteContext.Provider>
  );
};

export const useAppwrite = (): Appwrite | null => {
  const context = React.useContext(AppwriteContext);
  if (context === undefined) {
    throw new Error("useAppwrite must be used within a CountProvider");
  }
  return context;
};
