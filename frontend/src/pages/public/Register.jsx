// import { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import Navbar from '../../components/common/Navbar';
// import { authApi } from '../../api/auth.api';
// import { useAuth } from '../../context/AuthContext';

// export default function Register() {
//   const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'JOB_SEEKER' });
//   const [loading, setLoading] = useState(false);
//   const { login } = useAuth();
//   const nav = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const { data } = await authApi.register(form);
//       login(data.user, data.token);
//       toast.success('Account created!');
//       nav(data.user.role === 'COMPANY' ? '/recruiter' : '/seeker');
//     } catch (e) {
//       toast.error(e.response?.data?.message || 'Registration failed');
//     } finally { setLoading(false); }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-[80vh] grid place-items-center px-4 py-10">
//         <div className="card w-full max-w-md">
//           <h1 className="text-2xl font-bold text-center mb-2">Create Your Account</h1>
//           <p className="text-center text-gray-500 mb-6">Join JobConnect.</p>
//           <div className="grid grid-cols-2 gap-2 mb-6">
//             {['JOB_SEEKER', 'COMPANY'].map((r) => (
//               <button key={r} type="button" onClick={() => setForm({ ...form, role: r })}
//                 className={`py-2 rounded-lg text-sm font-medium ${form.role === r ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}`}>
//                 {r === 'JOB_SEEKER' ? 'Job Seeker' : 'Company'}
//               </button>
//             ))}
//           </div>
//           <form onSubmit={submit} className="space-y-4">
//             <div className="grid grid-cols-2 gap-3">
//               <div><label className="label">First Name</label>
//                 <input required className="input" value={form.firstName}
//                   onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></div>
//               <div><label className="label">Last Name</label>
//                 <input required className="input" value={form.lastName}
//                   onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></div>
//             </div>
//             <div><label className="label">Email</label>
//               <input required type="email" className="input" value={form.email}
//                 onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
//             <div><label className="label">Password (min 8)</label>
//               <input required type="password" minLength={8} className="input" value={form.password}
//                 onChange={(e) => setForm({ ...form, password: e.target.value })} /></div>
//             <button disabled={loading} className="btn-primary w-full">{loading ? 'Creating…' : 'Register'}</button>
//           </form>
//           <p className="text-center text-sm text-gray-500 mt-6">
//             Already have an account? <Link to="/login" className="text-primary font-medium">Login</Link>
//           </p>
//         </div>
//       </div>
//     </>
//   );
// // }

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../../components/common/Navbar';
import { authApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'JOB_SEEKER',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErrors([]);

    // Frontend validation (stops most 400s before they happen)
    const localErrors = [];
    if (form.password.length < 8) localErrors.push({ field: 'password', message: 'Password must be at least 8 characters' });
    if (!form.email.includes('@')) localErrors.push({ field: 'email', message: 'Enter a valid email' });
    if (!form.firstName.trim()) localErrors.push({ field: 'firstName', message: 'First name is required' });
    if (!form.lastName.trim()) localErrors.push({ field: 'lastName', message: 'Last name is required' });
    if (!['JOB_SEEKER', 'COMPANY'].includes(form.role)) localErrors.push({ field: 'role', message: 'Pick a valid role' });

    if (localErrors.length) {
      setErrors(localErrors);
      toast.error(localErrors[0].message);
      return;
    }

    setLoading(true);
    try {
      const { data } = await authApi.register(form);
      login(data.user, data.token);
      toast.success('Account created!');
      nav(data.user.role === 'COMPANY' ? '/recruiter' : '/seeker');
    } catch (err) {
      const resp = err.response?.data;
      const details = resp?.details || [];
      setErrors(details);

      // Show the FIRST specific error if available, otherwise the generic one
      const msg =
        details[0]?.message ||
        resp?.message ||
        err.message ||
        'Registration failed';
      toast.error(msg);
      console.error('Register failed:', resp || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[80vh] grid place-items-center px-4 py-10">
        <div className="card w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-2">Create Your Account</h1>
          <p className="text-center text-gray-500 mb-6">Join JobConnect.</p>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {['JOB_SEEKER', 'COMPANY'].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setForm({ ...form, role: r })}
                className={`py-2 rounded-lg text-sm font-medium ${
                  form.role === r ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {r === 'JOB_SEEKER' ? 'Job Seeker' : 'Company'}
              </button>
            ))}
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">First Name</label>
                <input
                  required
                  className="input"
                  value={form.firstName}
                  onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                />
              </div>
              <div>
                <label className="label">Last Name</label>
                <input
                  required
                  className="input"
                  value={form.lastName}
                  onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <input
                required
                type="email"
                className="input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div>
              <label className="label">Password (min 8 characters)</label>
              <input
                required
                type="password"
                minLength={8}
                className="input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Use at least 8 characters. Example: <code>Password@123</code>
              </p>
            </div>

            {errors.length > 0 && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                <ul className="list-disc pl-5 space-y-1">
                  {errors.map((e, i) => (
                    <li key={i}>
                      <strong>{e.field}:</strong> {e.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account…' : 'Register'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}