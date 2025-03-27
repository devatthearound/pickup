'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <style jsx global>{`
        body {
          padding: 0 !important;
          margin: 0 !important;
          background-color: #f8f9fa !important;
        }
        header, footer {
          display: none !important;
        }
        main {
          max-width: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }
      `}</style>
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    </>
  );
} 