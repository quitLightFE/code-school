"use client";
import Header from '#/features/landing/Header';

import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
    	{/*<Header />*/} 
    	<div
        aria-hidden="true"
        className="absolute left-40 top-40 size-96 rounded-full bg-accent/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute bottom-40 right-40 size-96 rounded-full bg-default/10 blur-3xl"
      />

      {children}
    </main>
  );
}
