import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { routeTree } from './routeTree.gen';

import './index.css';
import { AuthProvider, useAuth } from './auth';

const queryClient = new QueryClient({});
const router = createRouter({
    routeTree,
    defaultPreload: 'intent',
    context: {
        auth: undefined!
    }
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router;
    }
}

function InnerApp() {
    const auth = useAuth();
    return (
        <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} context={{ auth }} />
        </QueryClientProvider>
    );
}

const rootElement = document.getElementById('root')!;
if (!rootElement?.innerHTML) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <AuthProvider>
            <InnerApp />
        </AuthProvider>
    );
}
