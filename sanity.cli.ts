import { defineCliConfig } from 'sanity/cli';
import { projectId, dataset } from './src/sanity/env';

// Used by the Sanity CLI for `sanity dataset import` (seeding) and `sanity deploy`.
export default defineCliConfig({ api: { projectId, dataset } });
