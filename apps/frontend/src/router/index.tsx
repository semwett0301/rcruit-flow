import React from 'react';
import { BrowserRouter, Navigate, useRoutes } from 'react-router-dom';
import { IntroductionPage } from 'pages/IntroductionPage';
import { NotFoundPage } from 'pages/NotFoundPage';

const routes = [
  {
    path: '/intromail',
    element: <IntroductionPage />,
  },
  {
    path: '/',
    element: <Navigate to="/intromail" replace />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

const AppRoutes = () => useRoutes(routes);

const AppRouter: React.FC = () => (
  <BrowserRouter basename={import.meta.env.VITE_ROUTER_BASE || '/'}>
    <AppRoutes />
  </BrowserRouter>
);

export default AppRouter;
