import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import { authApi } from '../../api/auth.api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success('If that email exists, we sent a reset link.');
    } catch { toast.error('Something went wrong'); }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[70vh] grid place-items-center px-4">
        <div className="card w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2">Forgot Password?</h1>
          <p className="text-center text-gray-500 mb-6">We'll send you a reset link.</p>
          {sent ? (
            <p className="text-center text-success">Check your email (see backend console for dev).</p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div><label className="label">Email</label>
                <input required type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} /></div>
              <button className="btn-primary w-full">Send Reset Link</button>
            </form>
          )}
          <p className="text-center text-sm text-gray-500 mt-6">
            <Link to="/login" className="text-primary font-medium">Back to login</Link>
          </p>
        </div>
      </div>
    </>
  );
}