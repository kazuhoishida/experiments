import type { Config } from "prismic-ts-codegen"

const config: Config = {
  repositoryName: "kazuho-lab-test",
  output: "./prismic-models.d.ts",

  models: {
    files: ["./customtypes/**/index.json", "./slices/**/model.json"],
  },
}

export default config