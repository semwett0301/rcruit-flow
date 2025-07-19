import React from 'react';
import { BrowserRouter, useRoutes } from 'react-router-dom';
import Home from 'pages/Home';
import NotFound from 'pages/NotFound';

const routes = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

const AppRoutes = () => useRoutes(routes);

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default AppRouter;
