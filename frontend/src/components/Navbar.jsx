import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const buttonBase = 'rounded-md px-4 py-2 text-sm font-semibold transition';

function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/20 bg-white/85 shadow-sm shadow-slate-950/5 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link to="/" className="flex items-center gap-3 text-xl font-bold text-slate-950">
          <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-sm font-black text-white">
            TT
          </span>
          <span>TT Manager</span>
          </Link>
        </motion.div>

        <div className="flex items-center gap-2">
          <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
            <Link to="/login" className={`${buttonBase} text-slate-700 hover:bg-slate-100 hover:text-slate-950`}>
              Login
            </Link>
          </motion.div>
          <motion.div whileHover={{ y: -1, scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              to="/signup"
              className={`${buttonBase} bg-slate-950 text-white shadow-sm shadow-slate-950/20 hover:bg-slate-800`}
            >
              Signup
            </Link>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
