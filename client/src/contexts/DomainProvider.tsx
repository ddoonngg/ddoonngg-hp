import { createContext, useContext } from "react";

// Create a context object
const DomainContext = createContext<{
  assistantName: "Danile" | "Tina";
}>({ assistantName: "Danile" });

export const useDomainContext = () => useContext(DomainContext);

// Context provider component
export const DomainProvider = ({ children }: { children: React.ReactNode }) => {
  // Get domain name
  const domainName = window.location.hostname;
  const assistantName =
    domainName.indexOf("localhost") !== -1 || domainName.indexOf("don") !== -1
      ? "Danile"
      : "Tina";

  return (
    <DomainContext.Provider value={{ assistantName }}>
      {children}
    </DomainContext.Provider>
  );
};
