import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, ListTodo, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import api from '../services/api.js';
import { itemVariants, listVariants, pageTransition, pageVariants, sectionVariants } from '../utils/motion.js';

const features = [
  {
    icon: ListTodo,
    title: 'Task Management',
    description: 'Create, assign, and organize team responsibilities from one focused workspace.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Keep admins and members aligned with clear ownership and role-based access.'
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracking',
    description: 'Follow every task from pending to done with simple status visibility.'
  }
];

function Home() {
  const [status, setStatus] = useState('Checking API...');

  useEffect(() => {
    api
      .get('/health')
      .then((response) => setStatus(response.data.message))
      .catch(() => setStatus('Backend is not reachable yet.'));
  }, []);

  return (
    <>
      <Navbar />
      <motion.main
        className="min-h-screen bg-white"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
      >
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_#dbeafe_0,_transparent_34%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_45%,_#f0fdfa_100%)] px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
          <motion.div className="mx-auto max-w-5xl text-center" variants={listVariants} initial="hidden" animate="show">
            <motion.p variants={itemVariants} className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/75 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur">
              <CheckCircle2 className="h-4 w-4 text-teal-600" />
              Built for organized table tennis teams
            </motion.p>

            <motion.h1 variants={itemVariants} className="mx-auto mt-8 max-w-4xl text-5xl font-bold leading-tight text-slate-950 sm:text-6xl lg:text-7xl">
              Manage tasks, teams, and progress without the busywork.
            </motion.h1>

            <motion.p variants={itemVariants} className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
              TT Manager gives admins and members a polished workspace for assigning tasks, tracking progress, and keeping team operations moving.
            </motion.p>

            <motion.div variants={itemVariants} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <motion.div className="w-full sm:w-auto" whileHover={{ y: -2, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/signup"
                className="inline-flex w-full justify-center rounded-md bg-slate-950 px-6 py-3 text-center text-sm font-semibold text-white shadow-xl shadow-slate-950/20 transition hover:bg-slate-800 sm:w-auto"
              >
                Get Started
              </Link>
              </motion.div>
              <motion.div className="w-full sm:w-auto" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/login"
                className="inline-flex w-full justify-center rounded-md border border-slate-300 bg-white/80 px-6 py-3 text-center text-sm font-semibold text-slate-800 shadow-sm backdrop-blur transition hover:border-slate-400 hover:bg-white sm:w-auto"
              >
                Login
              </Link>
              </motion.div>
            </motion.div>

            <motion.div variants={itemVariants} className="mx-auto mt-12 max-w-xl rounded-lg border border-white/70 bg-white/70 px-5 py-4 text-sm font-medium text-slate-700 shadow-sm backdrop-blur">
              API status: <span className="text-teal-700">{status}</span>
            </motion.div>
          </motion.div>
        </section>

        <section className="px-5 py-16 sm:px-6 lg:px-8">
          <motion.div className="mx-auto max-w-7xl" variants={sectionVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Everything in sync</p>
              <h2 className="mt-3 text-3xl font-bold text-slate-950 sm:text-4xl">A cleaner way to run team operations</h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                Simple tools for admins and members, designed to stay clear as your task list grows.
              </p>
            </div>

            <motion.div className="mt-10 grid gap-6 md:grid-cols-3" variants={listVariants} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
              {features.map((feature) => {
                const Icon = feature.icon;

                return (
                  <motion.article
                    key={feature.title}
                    variants={itemVariants}
                    whileHover={{ y: -6, scale: 1.01 }}
                    className="rounded-xl border border-slate-200 bg-white p-7 shadow-lg shadow-slate-200/70 transition-shadow hover:shadow-xl hover:shadow-slate-200"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-teal-50 text-teal-700 ring-1 ring-teal-100">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-6 text-xl font-bold text-slate-950">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{feature.description}</p>
                  </motion.article>
                );
              })}
            </motion.div>
          </motion.div>
        </section>
      </motion.main>
    </>
  );
}

export default Home;
