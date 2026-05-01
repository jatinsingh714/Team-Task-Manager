import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import api, { API } from '../services/api.js';
import { itemVariants, pageTransition, pageVariants } from '../utils/motion.js';

const emailPattern = /^\S+@\S+\.\S+$/;

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value
    }));
  }

  function validateForm() {
    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      return 'Name, email, and password are required.';
    }

    if (!emailPattern.test(formData.email)) {
      return 'Please enter a valid email address.';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    return '';
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(`${API}/auth/signup`, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password
      });

      localStorage.setItem('tt_manager_token', response.data.token);
      localStorage.setItem('tt_manager_user', JSON.stringify(response.data.user));
      toast.success('Account created successfully. Redirecting...');

      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (requestError) {
      toast.error(requestError.apiMessage || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.main
      className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,_#dbeafe_0,_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_45%,_#f0fdfa_100%)] px-5 py-12"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <motion.section
        className="w-full max-w-md rounded-2xl border border-white/70 bg-white/80 p-8 shadow-2xl shadow-slate-950/10 backdrop-blur-xl"
        variants={itemVariants}
        initial="hidden"
        animate="show"
      >
        <Link to="/" className="inline-flex items-center gap-3 text-lg font-bold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-sm font-black text-white">
            TT
          </span>
          TT Manager
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Get started</p>
          <h1 className="mt-3 text-3xl font-bold text-slate-950">Create your account</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Start assigning tasks and tracking progress with your team.
          </p>
        </div>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="text-sm font-medium text-slate-700">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="mt-2 w-full rounded-md border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              placeholder="Create a password"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={loading ? undefined : { y: -2, scale: 1.01 }}
            whileTap={loading ? undefined : { scale: 0.98 }}
            className="w-full rounded-md bg-slate-950 px-4 py-3 font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
          >
            {loading ? 'Creating account...' : 'Signup'}
          </motion.button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800">
            Login
          </Link>
        </p>
      </motion.section>
    </motion.main>
  );
}

export default Signup;
