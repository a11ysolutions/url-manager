import { gql } from "@apollo/client";

export const GET_URLS = gql`
  query GetUrls {
    urls
  }
`;

export const SUBMIT_URLS = gql`
  mutation SubmitUrls($urls: [String!]!) {
    submitUrls(urls: $urls) {
      success
      message
    }
  }
`;
