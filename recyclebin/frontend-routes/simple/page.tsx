
"use client";

import React from 'react';
import SimpleHeader from './components/SimpleHeader';
import SimpleContent from './components/SimpleContent';
import SimpleFooter from './components/SimpleFooter';

export default function SimplePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <SimpleContent />
      <SimpleFooter />
    </div>
  );
}
