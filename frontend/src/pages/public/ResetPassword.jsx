import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import { authApi } from '../../api/auth.api';

export default function ResetPassword() {
  const [params] = useSearchParams();
  const nav = useNavigate();
  const [token, setToken] = useState(params.get('token') || '');
  const [password, setPassword] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    try {
      await authApi.resetPassword(token, password);
      toast.success('Password reset! Please login.');
      nav('/login');
    } catch (e) { toast.error(e.response?.data?.message || 'Failed'); }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] grid place-items-center px-4">
        <div className="card w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2">Reset Password</h1>
          <form onSubmit={submit} className="space-y-4">
            <div><label className="label">Reset Token</label>
              <input required className="input" value={token} onChange={(e) => setToken(e.target.value)} /></div>
            <div><label className="label">New Password</label>
              <input required type="password" minLength={8} className="input" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <button className="btn-primary w-full">Reset Password</button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/login" className="text-primary font-medium">Back to login</Link>
          </p>
        </div>
      </div>
    </>
  );
}