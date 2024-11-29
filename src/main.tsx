import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ApolloProvider,
  ApolloClient,
  NormalizedCacheObject,
} from "@apollo/client";
import { ClerkProvider, useAuth, useUser } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";
import { createApolloClient } from "./lib/apollo";

function AppWithProviders() {
  const { getToken } = useAuth();
  const { isSignedIn } = useUser();
  const [client, setClient] =
    useState<ApolloClient<NormalizedCacheObject> | null>(null);

  useEffect(() => {
    const initApollo = async () => {
      if (isSignedIn) {
        try {
          const token = await getToken();
          if (token) {
            console.log("Got token from Clerk:", "Token exists");
            setClient(createApolloClient(token));
          }
        } catch (error) {
          console.error("Error getting token:", error);
        }
      } else {
        // Clear the client when user is not signed in
        setClient(null);
      }
    };

    initApollo();
  }, [getToken, isSignedIn]);

  return (
    <ApolloProvider client={client || createApolloClient(null)}>
      <App />
    </ApolloProvider>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <AppWithProviders />
    </ClerkProvider>
  </StrictMode>
);
