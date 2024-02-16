// vite.config.ts
import { defineConfig } from 'vite';
import { TanStackRouterVite } from '@tanstack/router-vite-plugin';

import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    plugins: [TanStackRouterVite()],
    define: {
        'process.env': process.env
    }
});
