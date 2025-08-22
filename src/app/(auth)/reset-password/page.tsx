'use client';
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { strapiPost } from '@/lib/strapi-client';

export default function ResetPasswordPage() {
  const [form, setForm] = useState({
    code: '',
    password: '',
    passwordConfirmation: '',
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const codeFromUrl = searchParams.get('code');
    if (codeFromUrl) {
      setForm((prev) => ({ ...prev, code: codeFromUrl }));
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { code, password, passwordConfirmation } = form;
    if (!code || !password || !passwordConfirmation) {
      setError('All fields are required');
      return;
    }
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }
    try {
      await strapiPost('/api/auth/reset-password', form);
      setMessage('Password reset successful — redirecting to login…');
      setError('');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-sm mx-auto">
      {!form.code && (
        <input
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          placeholder="Reset code"
          className="border p-2 w-full"
        />
      )}
      <input
        type="password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="New password"
        className="border p-2 w-full"
      />
      <input
        type="password"
        value={form.passwordConfirmation}
        onChange={(e) =>
          setForm({ ...form, passwordConfirmation: e.target.value })
        }
        placeholder="Confirm new password"
        className="border p-2 w-full"
      />
      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}
      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Reset Password
      </button>
    </form>
  );
}
