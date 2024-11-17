import type { CodegenConfig } from '@graphql-codegen/cli';
import * as env from './env.json';

const config: CodegenConfig = {
    overwrite: true,
    schema: `${env.VITE_API_URI}/graphql`,
    documents: ['src/**/*.{ts,tsx}'],
    generates: {
        'src/__generated__/': {
            preset: 'client',
            plugins: [],
            presetConfig: {
                gqlTagName: 'gql',
            },
        },
    },
};

export default config;
