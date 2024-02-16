import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
    component: () => (
        <div className="mx-auto w-[500px]">
            <Outlet />
        </div>
    )
});
