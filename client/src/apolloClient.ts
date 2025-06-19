import { ApolloClient, InMemoryCache, split, HttpLink } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// Mets l'URL de ton backend GraphQL ici (http en général pour queries/mutations)
const httpLink = new HttpLink({
  uri: "http://localhost:3001/graphql", // adapte le port si besoin !
});

// Mets l'URL WebSocket (ws) ici pour les subscriptions
const wsLink = new GraphQLWsLink(createClient({
  url: "ws://localhost:3001/graphql",
}));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLink,
);

export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});
