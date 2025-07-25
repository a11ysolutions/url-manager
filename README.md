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

- Parse the list of URLs into a hierarchical tree structure with **5 levels**:
  1. Application
  2. Client
  3. Template
  4. Site Edition
  5. Full URL (leaf node)

- Use [PrimeReact's Tree component](https://primereact.org/tree/) to display the tree.
- Enable **multi-selection** with checkboxes.
- **Selecting any parent node** (e.g., a Client or Template) should automatically select all descendant leaf nodes (full URLs).
- Store only the **leaf-level full URLs** in Redux state — not the entire tree.
- Show a **list of selected URLs on screen**. This list should update dynamically as the user selects or deselects tree nodes.

#### Example Tree Structure (with leaf nodes showing full URLs):

```
ApplicationA
├── ClientA
│   ├── Template1
│   │   ├── Edition1
│   │   │   └── https://ApplicationA/ClientA/Template1/Edition1
│   │   └── Edition2
│   │       └── https://ApplicationA/ClientA/Template1/Edition2
│   └── Template2
│       └── Edition1
│           └── https://ApplicationA/ClientA/Template2/Edition1
└── ClientB
    └── Template3
        └── Edition1
            └── https://ApplicationA/ClientB/Template3/Edition1
```
```
dashboard
├── acme
│   ├── blog
│   │   ├── dev
│   │   │   └── https://dashboard/acme/blog/dev
│   │   └── prod
│   │       └── https://dashboard/acme/blog/prod
│   └── news
│       └── v1
│           └── https://dashboard/acme/news/v1
└── globex
    └── landing
        └── v2
            └── https://dashboard/globex/landing/v2
```
#### Example: Selecting the `blog` node under `acme`

- ✅ Should automatically select both of these leaf URLs:
  - `https://dashboard/acme/blog/dev`
  - `https://dashboard/acme/blog/prod`

- 🔁 Deselecting `blog` will remove both from selection.

This behavior should apply recursively for all upper-level nodes (application → client → template → site edition).

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
