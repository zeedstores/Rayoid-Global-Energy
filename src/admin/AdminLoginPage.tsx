
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { supabase } from '../lib/supabase';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (signInError || !data.user) {
        setError('Sign-in failed. Check your email and password.');
        return;
      }

      const { data: admin, error: adminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (adminError || !admin) {
        await supabase.auth.signOut();
        setError('You are not authorized to access the admin dashboard.');
        return;
      }

      navigate('/admin', { replace: true });
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06191F] px-5 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl sm:p-10"
      >
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#278747]">
          Raynoid Global Energy
        </p>

        <h1 className="mt-3 text-3xl font-semibold text-[#06191F]">
          Admin login
        </h1>

        <p className="mt-2 text-sm leading-6 text-gray-500">
          Sign in to access the website dashboard.
        </p>

        <label className="mt-7 block text-sm font-medium text-gray-700">
          Email address
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#278747]"
            placeholder="Admin email"
          />
        </label>

        <label className="mt-5 block text-sm font-medium text-gray-700">
          Password
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#278747]"
            placeholder="Admin password"
          />
        </label>

        {error && (
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-lg bg-[#278747] px-5 py-3 font-semibold text-white transition hover:bg-[#206D3B] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>

        <Link
          to="/"
          className="mt-5 block text-center text-sm text-gray-500 hover:text-[#278747]"
        >
          Return to website
        </Link>
      </form>
    </main>
  );
}
