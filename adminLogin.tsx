import React, { useState } from 'react';
import { useAdminAuth } from './useAdminAuth';

const AdminLogin: React.FC = () => {
  const { signInAdmin, signOutAdmin, isAdmin, user, loading, error, clearError } = useAdminAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();
    setSubmitting(true);
    try {
      await signInAdmin(email.trim(), password);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-sm text-gray-600">Loading…</div>;
  }

  if (isAdmin && user) {
    return (
      <div className="p-6 border rounded-lg bg-white shadow-sm max-w-md">
        <h2 className="text-lg font-semibold mb-2">Admin</h2>
        <p className="text-sm text-gray-600 mb-4">Signed in as {user.email}</p>
        <button
          onClick={signOutAdmin}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded hover:bg-gray-900"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 border rounded-lg bg-white shadow-sm max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="admin@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded px-3 py-2 text-sm"
          placeholder="••••••••"
          required
        />
      </div>

      {(error || formError) && (
        <div className="text-sm text-red-600">{formError || error}</div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-60"
      >
        {submitting ? 'Signing in…' : 'Sign in as Admin'}
      </button>
    </form>
  );
};

export default AdminLogin;
