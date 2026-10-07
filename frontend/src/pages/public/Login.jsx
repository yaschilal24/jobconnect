import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      login(data.user, data.token);
      toast.success('Welcome back!');
      const dest = data.user.role === 'JOB_SEEKER' ? '/seeker'
        : data.user.role === 'COMPANY' ? '/recruiter' : '/admin';
      nav(dest);
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed');
    } finally { setLoading(false); }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] grid place-items-center px-4">
        <div className="card w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back!</h1>
          <p className="text-center text-gray-500 mb-6">Login to your JobConnect account</p>
          <form onSubmit={submit} className="space-y-4">
            <div><label className="label">Email</label>
              <input required type="email" className="input" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="label">Password</label>
              <input required type="password" className="input" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
            <button disabled={loading} className="btn-primary w-full">{loading ? 'Signing in…' : 'Login'}</button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-4">
            <Link to="/forgot-password" className="text-primary font-medium">Forgot password?</Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            Don't have an account? <Link to="/register" className="text-primary font-medium">Register</Link>
          </p>
          <div className="mt-6 p-3 rounded-lg bg-gray-50 text-xs text-gray-600">
            <p className="font-semibold mb-1">Demo (after seed):</p>
            <p>admin@jobconnect.dev / Password@123</p>
            <p>recruiter@abctech.dev / Password@123</p>
            <p>seeker@dev.com / Password@123</p>
          </div>
        </div>
      </div>
    </>
  );
}