'use client';

import Header from './partials/Header';
import Footer from './partials/Footer';
import { memo } from 'react';

function MainLayout({ children, header = '' }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-grow mx-auto p-2 border-x-[1px] dark:border-gray-800 w-full max-w-7xl">
        <div className="flex-grow bg-white dark:bg-[#141e2d] min-h-screen">
          {header && (
            <>
              <div className="bg-gray-50 dark:bg-gray-800 p-4">
                <h5 className="font-semibold text-xl">
                  {header}
                </h5>
              </div>
            </>
          )}
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default memo(MainLayout);