import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './layout/Header';
import Footer from './layout/Footer';
import FabActions from './ui/FabActions';

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      <Header />
      <main id="main" className="mx-auto w-full max-w-6xl flex-1 px-4 pb-28 pt-4 md:pb-10" role="main">
        <Outlet />
      </main>
      <FabActions />
      <Footer />
    </div>
  );
}
