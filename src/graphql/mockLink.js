import { ApolloLink, Observable } from "@apollo/client";

const mockUrls = [
    "https://dashboard/globex/landing/v2",
    "https://portal/globex/blog/dev",
    "https://dashboard/acme/news/v2",
    "https://platform/initech/blog/v2",
    "https://platform/acme/profile/staging",
    "https://portal/umbrella/news/staging",
    "https://platform/globex/shop/prod",
    "https://cms/acme/landing/dev",
    "https://admin/wonka/blog/v1",
    "https://cms/globex/news/v2",
    "https://admin/umbrella/shop/dev",
    "https://cms/initech/landing/staging",
    "https://platform/initech/landing/staging",
    "https://admin/umbrella/blog/v2",
    "https://portal/globex/profile/staging",
    "https://cms/initech/landing/dev",
    "https://platform/umbrella/shop/dev",
    "https://cms/initech/shop/dev",
    "https://portal/wonka/shop/dev",
    "https://portal/acme/news/v1",
    "https://portal/acme/news/staging",
    "https://cms/wonka/profile/dev",
    "https://dashboard/umbrella/landing/staging",
    "https://admin/globex/news/dev",
    "https://admin/acme/shop/prod",
    "https://platform/acme/news/prod",
    "https://dashboard/wonka/landing/staging",
    "https://cms/umbrella/shop/staging",
    "https://platform/wonka/blog/staging",
    "https://admin/umbrella/profile/prod",
    "https://admin/globex/landing/v2",
    "https://portal/initech/shop/staging",
    "https://portal/acme/landing/prod",
    "https://dashboard/acme/shop/dev",
    "https://admin/globex/shop/staging",
    "https://portal/acme/shop/prod",
    "https://admin/wonka/news/staging",
    "https://cms/acme/profile/prod",
    "https://cms/wonka/profile/staging",
    "https://portal/globex/landing/prod",
    "https://cms/initech/shop/prod",
    "https://dashboard/umbrella/landing/dev",
    "https://cms/acme/news/prod",
    "https://admin/wonka/landing/staging",
    "https://portal/acme/profile/v2",
    "https://dashboard/umbrella/news/v1",
    "https://platform/initech/news/v2",
    "https://cms/umbrella/blog/prod",
    "https://platform/umbrella/blog/v2",
    "https://dashboard/wonka/shop/v2"
  ];

export const mockLink = new ApolloLink((operation) => {
  return new Observable((observer) => {
    const { operationName, variables } = operation;

    setTimeout(() => {
      if (operationName === "GetUrls") {
        observer.next({
          data: {
            urls: mockUrls,
          },
        });
      } else if (operationName === "SubmitUrls") {
        console.log("Mutation Payload:", variables);
        observer.next({
          data: {
            submitUrls: {
              success: true,
              message: "Mock submission successful",
            },
          },
        });
      } else {
        observer.error(new Error("Unknown operation"));
      }

      observer.complete();
    }, 500); // Simulate network delay
  });
});
