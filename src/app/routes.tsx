import { createBrowserRouter } from 'react-router';
import { PublicLayout } from '../components/Layout';

const page = (loader: () => Promise<{ default: React.ComponentType }>) => async () => {
  const module = await loader();
  return { Component: module.default };
};

export const router = createBrowserRouter([
  {
    path: '/',
    Component: PublicLayout,
    children: [
      { index: true, lazy: page(() => import('../pages/HomePage')) },
      { path: 'about', lazy: page(() => import('../pages/AboutPage')) },
      { path: 'services', lazy: page(() => import('../pages/ServicesPage')) },
      { path: 'services/:slug', lazy: page(() => import('../pages/ServiceDetailPage')) },
      { path: 'projects', lazy: page(() => import('../pages/ProjectsPage')) },
      { path: 'why-choose-us', lazy: page(() => import('../pages/WhyChooseUsPage')) },
      { path: 'contact', lazy: page(() => import('../pages/ContactPage')) },
      { path: 'not-found', lazy: page(() => import('../pages/NotFoundPage')) },
      { path: '*', lazy: page(() => import('../pages/NotFoundPage')) },
    ],
  },
 { path: '/admin/login', lazy: page(() => import('../admin/AdminLoginPage')) },
{ path: '/admin', lazy: page(() => import('../admin/AdminPage')) },
]);
