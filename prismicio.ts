import * as prismic from "@prismicio/client";
import type { LinkResolverFunction } from "@prismicio/helpers";
import type { CreateClientConfig } from "@prismicio/next";
import { enableAutoPreviews } from "@prismicio/next";

import sm from "./sm.json";

export const repositoryName = prismic.getRepositoryName(sm.apiEndpoint);

export const linkResolver: LinkResolverFunction<string> = (doc) => {
  if (doc.type === "article") {
    return `/articles/${doc.uid}`;
  }
  if (doc.type === "project") {
    return `/projects/${doc.uid}`;
  }
  if (doc.type === "creator") {
    return `/creators/${doc.uid}`;
  }
  if (doc.type === "top") {
    return '/';
  }

  if (doc.type === "page") {
    return `/${doc.uid}`;
  }

  return "/";
};

export const createClient = (config: CreateClientConfig = {}) => {
  const client = prismic.createClient(sm.apiEndpoint, {
    routes: [
      {
        type: "page",
        path: "/:uid",
      },
    ],
  });

  enableAutoPreviews({
    client,
    previewData: config.previewData,
    req: config.req,
  });

  return client;
};
