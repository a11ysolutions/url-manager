import { ApolloClient, InMemoryCache } from "@apollo/client";
import { mockLink } from "./mockLink";

export const client = new ApolloClient({
  link: mockLink,
  cache: new InMemoryCache(),
});
