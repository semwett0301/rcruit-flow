import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import { IntroductionPage } from 'pages/IntroductionPage';
import { NotFoundPage } from 'pages/NotFoundPage';

const routes = [
  {
    path: '/',
    element: <IntroductionPage />,
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
