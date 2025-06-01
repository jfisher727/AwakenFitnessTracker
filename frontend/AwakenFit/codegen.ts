
import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
    overwrite: true,
    schema: "http://192.168.1.10:8000/api/graphql",
    documents: ["graphql/**/*.graphql"],
    generates: {
        "./graphql/types.ts": {
            plugins: [
                "typescript",
                "typescript-operations",
                "typescript-react-apollo"
            ],
        }
    },
};

export default config;
