'use client';
import { memo } from 'react';

function HomeLayout({ children }) {
  return (

    <section className="mx-auto px-4 py-16 w-full max-w-7xl text-center">
        {children}
    </section>

  );
}

export default memo(HomeLayout);