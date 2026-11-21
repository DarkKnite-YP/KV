import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Layout } from './components/layout';
import { PageLoading } from './components/ui';

// ─── Lazy-loaded pages ───

// Core pages
const HomePage = lazy(() => import('./pages/HomePage'));
const OurStoryPage = lazy(() => import('./pages/OurStoryPage'));
const OrchardPage = lazy(() => import('./pages/OrchardPage'));
const FarmingPracticesPage = lazy(() => import('./pages/FarmingPracticesPage'));

// Shop
const ShopPage = lazy(() => import('./pages/shop/ShopPage'));
const ProductDetailPage = lazy(() => import('./pages/shop/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/shop/CartPage'));
const CheckoutPage = lazy(() => import('./pages/shop/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/shop/OrderSuccessPage'));

// Adopt
const AdoptPage = lazy(() => import('./pages/adopt/AdoptPage'));
const HowItWorksPage = lazy(() => import('./pages/adopt/HowItWorksPage'));
const AdoptionCheckoutPage = lazy(() => import('./pages/adopt/AdoptionCheckoutPage'));
const AdoptionSuccessPage = lazy(() => import('./pages/adopt/AdoptionSuccessPage'));

// Visit & Journal
const VisitPage = lazy(() => import('./pages/VisitPage'));
const JournalPage = lazy(() => import('./pages/journal/JournalPage'));
const JournalArticlePage = lazy(() => import('./pages/journal/JournalArticlePage'));

// Info & Contact
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FAQPage = lazy(() => import('./pages/FAQPage'));

// Legal
const ShippingPage = lazy(() => import('./pages/legal/ShippingPage'));
const RefundPolicyPage = lazy(() => import('./pages/legal/RefundPolicyPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage'));
const TermsPage = lazy(() => import('./pages/legal/TermsPage'));
const AdoptionTermsPage = lazy(() => import('./pages/legal/AdoptionTermsPage'));

// Account
const AccountPage = lazy(() => import('./pages/account/AccountPage'));
const AccountOrdersPage = lazy(() => import('./pages/account/AccountOrdersPage'));
const AccountOrderDetailPage = lazy(() => import('./pages/account/AccountOrderDetailPage'));
const AccountAdoptionsPage = lazy(() => import('./pages/account/AccountAdoptionsPage'));
const AccountAdoptionDetailPage = lazy(() => import('./pages/account/AccountAdoptionDetailPage'));
const AccountAddressesPage = lazy(() => import('./pages/account/AccountAddressesPage'));
const AccountProfilePage = lazy(() => import('./pages/account/AccountProfilePage'));
const AccountVisitsPage = lazy(() => import('./pages/account/AccountVisitsPage'));

// Admin
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));

// 404
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<PageLoading />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'our-story',
        element: (
          <Suspense fallback={<PageLoading />}>
            <OurStoryPage />
          </Suspense>
        ),
      },
      {
        path: 'orchard',
        element: (
          <Suspense fallback={<PageLoading />}>
            <OrchardPage />
          </Suspense>
        ),
      },
      {
        path: 'farming-practices',
        element: (
          <Suspense fallback={<PageLoading />}>
            <FarmingPracticesPage />
          </Suspense>
        ),
      },
      // Shop
      {
        path: 'shop',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ShopPage />
          </Suspense>
        ),
      },
      {
        path: 'shop/:slug',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ProductDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'cart',
        element: (
          <Suspense fallback={<PageLoading />}>
            <CartPage />
          </Suspense>
        ),
      },
      {
        path: 'checkout',
        element: (
          <Suspense fallback={<PageLoading />}>
            <CheckoutPage />
          </Suspense>
        ),
      },
      {
        path: 'order-success',
        element: (
          <Suspense fallback={<PageLoading />}>
            <OrderSuccessPage />
          </Suspense>
        ),
      },
      // Adopt
      {
        path: 'adopt-a-tree',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdoptPage />
          </Suspense>
        ),
      },
      {
        path: 'adopt-a-tree/how-it-works',
        element: (
          <Suspense fallback={<PageLoading />}>
            <HowItWorksPage />
          </Suspense>
        ),
      },
      {
        path: 'adopt-a-tree/checkout',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdoptionCheckoutPage />
          </Suspense>
        ),
      },
      {
        path: 'adoption-success',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdoptionSuccessPage />
          </Suspense>
        ),
      },
      // Visit & Journal
      {
        path: 'visit',
        element: (
          <Suspense fallback={<PageLoading />}>
            <VisitPage />
          </Suspense>
        ),
      },
      {
        path: 'journal',
        element: (
          <Suspense fallback={<PageLoading />}>
            <JournalPage />
          </Suspense>
        ),
      },
      {
        path: 'journal/:slug',
        element: (
          <Suspense fallback={<PageLoading />}>
            <JournalArticlePage />
          </Suspense>
        ),
      },
      // Info
      {
        path: 'contact',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ContactPage />
          </Suspense>
        ),
      },
      {
        path: 'faq',
        element: (
          <Suspense fallback={<PageLoading />}>
            <FAQPage />
          </Suspense>
        ),
      },
      // Legal
      {
        path: 'shipping',
        element: (
          <Suspense fallback={<PageLoading />}>
            <ShippingPage />
          </Suspense>
        ),
      },
      {
        path: 'refund-policy',
        element: (
          <Suspense fallback={<PageLoading />}>
            <RefundPolicyPage />
          </Suspense>
        ),
      },
      {
        path: 'privacy-policy',
        element: (
          <Suspense fallback={<PageLoading />}>
            <PrivacyPolicyPage />
          </Suspense>
        ),
      },
      {
        path: 'terms',
        element: (
          <Suspense fallback={<PageLoading />}>
            <TermsPage />
          </Suspense>
        ),
      },
      {
        path: 'adoption-terms',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdoptionTermsPage />
          </Suspense>
        ),
      },
      // Account
      {
        path: 'account',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AccountPage />
          </Suspense>
        ),
      },
      {
        path: 'account/orders',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AccountOrdersPage />
          </Suspense>
        ),
      },
      {
        path: 'account/orders/:id',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AccountOrderDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'account/adoptions',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AccountAdoptionsPage />
          </Suspense>
        ),
      },
      {
        path: 'account/adoptions/:id',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AccountAdoptionDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'account/addresses',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AccountAddressesPage />
          </Suspense>
        ),
      },
      {
        path: 'account/profile',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AccountProfilePage />
          </Suspense>
        ),
      },
      {
        path: 'account/visits',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AccountVisitsPage />
          </Suspense>
        ),
      },
      // Admin
      {
        path: 'admin/*',
        element: (
          <Suspense fallback={<PageLoading />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      // 404
      {
        path: '*',
        element: (
          <Suspense fallback={<PageLoading />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
