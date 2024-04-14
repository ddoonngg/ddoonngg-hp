import { createContext, useContext } from "react";

// Create a context object
const DomainContext = createContext<{
  assistantName: "Dong" | "Tina";
}>({ assistantName: "Tina" });

export const useDomainContext = () => useContext(DomainContext);

// Context provider component
export const DomainProvider = ({ children }: { children: React.ReactNode }) => {
  // Get domain name
  const domainName = window.location.hostname;
  const assistantName =
    domainName.indexOf("localhost") !== -1 ||
    domainName.indexOf("tc4869") !== -1
      ? "Dong"
      : "Dong";

  return (
    <DomainContext.Provider value={{ assistantName }}>
      {children}
    </DomainContext.Provider>
  );
};
