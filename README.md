# 🧪 Frontend Developer Test – Tree-based URL Manager

## 🧠 Objective

Build an interface to visualize a list of URLs as a tree, enable filtering and selection, and trigger a GraphQL mutation with selected nodes.

## 🧰 Tech Requirements

- React
- Redux
- PrimeReact
- Apollo Client (GraphQL)
- JavaScript (no TypeScript)

## 🔗 Input Data

You will be querying a mock GraphQL endpoint to retrieve a list of URLs. Each URL will follow this format:

```
https://application/client/template/site-edition
```

Each URL represents a 4-level hierarchy:
- Level 1: Application
- Level 2: Client
- Level 3: Template
- Level 4: Site Edition

The query is already defined in the file:  
📄 `src/graphql/operations.js`

```graphql
query GetUrls {
  urls
}
```

This returns a hardcoded list of sample URLs via a mocked Apollo Link — no backend setup is needed.

Hint: Use the `useQuery` hook from Apollo Client to fetch the URLs.

## 🧱 Tasks

### 1. Tree View

- Parse the list of URLs into a hierarchical tree structure.
- Use [PrimeReact's Tree component](https://primereact.org/tree/) to display the tree.
- Allow selection and multi-selection of nodes (both parent and leaf).
- Store the selected items in Redux state.

#### Example Tree Structure:

```
Application A
├── Client A
│   ├── Template 1
│   │   ├── Edition 1
│   │   └── Edition 2
│   └── Template 2
│       └── Edition 1
└── Client B
    └── Template 3
        └── Edition 1
```

### 2. Filters

- Add multiselect dropdowns using PrimeReact to filter:
  - Applications
  - Clients
  - Templates
  - Site Editions
- These filters should dynamically update the tree content.
Suggestion: Give it some thought before starting. Maybe there is an optimal way to do it. 

### 3. Mutation

When the user clicks a **Submit** button, trigger a GraphQL mutation with the selected URLs.  
The mutation is defined in:  
📄 `src/graphql/operations.js`

```graphql
mutation SubmitUrls($urls: [String!]!) {
  submitUrls(urls: $urls) {
    success
    message
  }
}
```

- This mutation is mocked using a custom Apollo Link.
- It logs the submitted URLs to the browser console and returns a mock success response.
- You **do not need to build a backend**.

Hint: Use the `useMutation` hook from Apollo Client to trigger the mutation.

## 📝 Notes

- **Do not worry about styling** – making the app visually attractive is **not** a priority.
- You are **encouraged** to use AI tools, the internet, or any form of external help.
- There are **no restrictions** – you may create any files, folders, or install any npm packages you feel are helpful.
- Just be prepared to **discuss and defend your implementation decisions** in a follow-up conversation.

## 🚀 Getting Started

To run the project locally:

```bash
# Install dependencies
npm install

# Start the development server
npm start
```

## ✅ Submission Instructions

1. Fork this repository.
2. Implement your solution.
3. Open a pull request with your changes.
