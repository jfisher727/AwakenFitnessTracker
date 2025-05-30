
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: "http://192.168.1.10:8000/api/graphql",
    documents: ["app/**/*.tsx", "components/**/*.tsx"],
    generates: {
        "./__generated__/": {
            preset: "client",
            presetConfig: {
                gqlTagName: "gql",
            }
        },
        "./__generated__/types.ts": {
            plugins: ["typescript", "typescript-operations"],
        }
    },
};

export default config;
