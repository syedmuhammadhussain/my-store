// lib/logout.ts
'use client';

import { signOut } from 'next-auth/react';

export async function logout() {
  try {
    await fetch('/api/logout', { method: 'POST' }); // optional API route to revoke Strapi token
  } catch (err) {
    console.error('Error revoking Strapi token', err);
  } finally {
    signOut({ callbackUrl: '/login' });
  }
}
