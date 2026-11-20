export const pageHead = (title: string, description: string) => () => ({
  meta: [
    { title: `${title} · Relay` },
    { name: "description", content: description },
    { property: "og:title", content: `${title} · Relay` },
    { property: "og:description", content: description },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ],
});
