import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { setContext } from "@apollo/client/link/context";

// Création du lien HTTP classique
const httpLink = new HttpLink({
  uri: import.meta.env.VITE_API_URL ,
});

// Ajoute le header Authorization si token trouvé
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    }
  };
});


// Création du lien WebSocket pour les subscriptions, aussi avec le token
const wsLink = new GraphQLWsLink(
  createClient({
    url: import.meta.env.VITE_API_WS,
    connectionParams: () => {
      const token = localStorage.getItem("token");
      return {
        Authorization: token ? `Bearer ${token}` : "",
      };
    },
  }),
);

// Split selon type d'opération : subscription => WS, sinon => HTTP
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink), // on applique authLink sur les requêtes HTTP
);

// Instancie le client Apollo
export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
