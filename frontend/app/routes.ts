import {
  type RouteConfig,
  index,
  route,
} from '@react-router/dev/routes';

export default [
  index('routes/_index.tsx'),
  route('login', 'routes/login.tsx'),
  route('register', 'routes/register.tsx'),

  route('dashboard', 'routes/dashboard/_layout.tsx', [
    index('routes/dashboard/_index.tsx'),
    route('folder/:folderId', 'routes/dashboard/folder.$folderId.tsx'),
    route('search', 'routes/dashboard/search.tsx'),
  ]),
] satisfies RouteConfig;