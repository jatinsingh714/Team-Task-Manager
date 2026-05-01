import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { CheckCircle2, Clock3, Loader2, LogOut, Plus, RefreshCw, Search, Sparkles, Trash2 } from 'lucide-react';
import api, { API } from '../services/api.js';
import { itemVariants, listVariants, pageTransition, pageVariants } from '../utils/motion.js';

const statuses = ['pending', 'in-progress', 'done'];
const filterOptions = ['all', ...statuses];

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  'in-progress': 'bg-rose-50 text-rose-700 ring-rose-200',
  done: 'bg-emerald-50 text-emerald-700 ring-emerald-200'
};

function formatStatus(status) {
  return status.replace('-', ' ');
}

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [updatingTaskId, setUpdatingTaskId] = useState('');
  const [creating, setCreating] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedTo: ''
  });

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('tt_manager_user')) || null;
    } catch {
      return null;
    }
  }, []);

  const isAdmin = user?.role === 'admin';

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'done').length;
    const pending = tasks.filter((task) => task.status === 'pending').length;

    return {
      total: tasks.length,
      completed,
      pending
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
      const searchableText = `${task.title || ''} ${task.description || ''}`.toLowerCase();
      const matchesSearch = !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchesStatus && matchesSearch;
    });
  }, [searchQuery, statusFilter, tasks]);

  async function fetchTasks() {
    setLoading(true);

    try {
      const response = await api.get(`${API}/tasks`);
      setTasks(response.data.tasks || []);
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        localStorage.removeItem('tt_manager_token');
        localStorage.removeItem('tt_manager_user');
        navigate('/login');
        return;
      }

      toast.error(requestError.apiMessage || 'Unable to fetch tasks.');
    } finally {
      setLoading(false);
    }
  }

  async function fetchUsers() {
    if (!isAdmin) {
      return;
    }

    setLoadingUsers(true);

    try {
      const response = await api.get(`${API}/users`);
      setUsers(response.data.users || []);
    } catch (requestError) {
      toast.error(requestError.apiMessage || 'Unable to fetch users.');
    } finally {
      setLoadingUsers(false);
    }
  }

  useEffect(() => {
    if (!localStorage.getItem('tt_manager_token')) {
      navigate('/login');
      return;
    }

    fetchTasks();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  function handleLogout() {
    localStorage.removeItem('tt_manager_token');
    localStorage.removeItem('tt_manager_user');
    navigate('/login');
  }

  function handleFormChange(event) {
    const { name, value } = event.target;

    setTaskForm((current) => ({
      ...current,
      [name]: value
    }));
  }

  async function handleStatusChange(taskId, status) {
    setUpdatingTaskId(taskId);

    try {
      const response = await api.put(`${API}/tasks/${taskId}`, { status });

      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === taskId ? response.data.task : task))
      );
      toast.success('Task status updated.');
    } catch (requestError) {
      toast.error(requestError.apiMessage || 'Unable to update task status.');
    } finally {
      setUpdatingTaskId('');
    }
  }

  async function handleDeleteTask(taskId) {
    setUpdatingTaskId(taskId);

    try {
      await api.delete(`${API}/tasks/${taskId}`);
      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== taskId));
      toast.success('Task deleted successfully.');
    } catch (requestError) {
      toast.error(requestError.apiMessage || 'Unable to delete task.');
    } finally {
      setUpdatingTaskId('');
    }
  }

  async function handleCreateTask(event) {
    event.preventDefault();

    if (!taskForm.title.trim() || !taskForm.assignedTo.trim()) {
      toast.error('Title and assigned user are required.');
      return;
    }

    setCreating(true);

    try {
      const response = await api.post(`${API}/tasks`, {
        title: taskForm.title.trim(),
        description: taskForm.description.trim(),
        assignedTo: taskForm.assignedTo.trim()
      });

      setTasks((currentTasks) => [response.data.task, ...currentTasks]);
      setTaskForm({ title: '', description: '', assignedTo: '' });
      setShowCreateForm(false);
      toast.success('Task created successfully.');
    } catch (requestError) {
      toast.error(requestError.apiMessage || 'Unable to create task.');
    } finally {
      setCreating(false);
    }
  }

  return (
    <motion.main
      className="min-h-screen bg-slate-50"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
    >
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3 text-lg font-bold text-slate-950">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-slate-950 text-sm font-black text-white">
              TT
            </span>
            TT Manager
          </Link>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-950">{user?.name || 'User'}</p>
              <p className="text-xs capitalize text-slate-500">{user?.role || 'member'}</p>
            </div>
            <motion.button
              type="button"
              onClick={handleLogout}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-100"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        <motion.div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between" variants={itemVariants} initial="hidden" animate="show">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700 ring-1 ring-teal-100">
              <Sparkles className="h-4 w-4" />
              Productivity workspace
            </p>
            <h1 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">Task Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Track assignments, update progress, and keep every task moving from pending to done.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <motion.button
              type="button"
              onClick={fetchTasks}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </motion.button>

            {isAdmin && (
              <motion.button
                type="button"
                onClick={() => setShowCreateForm((current) => !current)}
                whileHover={{ y: -1, scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800"
              >
                <Plus className="h-4 w-4" />
                Create Task
              </motion.button>
            )}
          </div>
        </motion.div>

        <motion.div className="mt-8 grid gap-4 md:grid-cols-3" variants={listVariants} initial="hidden" animate="show">
          <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <p className="text-sm font-medium text-slate-500">Total Tasks</p>
            <p className="mt-3 text-4xl font-bold text-slate-950">{stats.total}</p>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Completed</p>
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            </div>
            <p className="mt-3 text-4xl font-bold text-slate-950">{stats.completed}</p>
          </motion.div>
          <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-slate-500">Pending</p>
              <Clock3 className="h-5 w-5 text-amber-600" />
            </div>
            <p className="mt-3 text-4xl font-bold text-slate-950">{stats.pending}</p>
          </motion.div>
        </motion.div>

        <AnimatePresence>
          {isAdmin && showCreateForm && (
          <motion.form
            onSubmit={handleCreateTask}
            initial={{ opacity: 0, height: 0, y: -12 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/70"
          >
            <div className="flex flex-col gap-2 border-b border-slate-200 pb-5">
              <h2 className="text-xl font-bold text-slate-950">Create Task</h2>
              <p className="text-sm text-slate-600">Assign a new task to a team member from your workspace.</p>
            </div>

            <div className="mt-5 grid gap-5 lg:grid-cols-3">
              <div>
                <label htmlFor="title" className="text-sm font-medium text-slate-700">
                  Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={taskForm.title}
                  onChange={handleFormChange}
                  className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                  placeholder="Prepare match schedule"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="assignedTo" className="text-sm font-medium text-slate-700">
                    Assigned User
                  </label>
                  {loadingUsers && <Loader2 className="h-4 w-4 animate-spin text-teal-600" />}
                </div>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={taskForm.assignedTo}
                  onChange={handleFormChange}
                  disabled={loadingUsers || users.length === 0}
                  className="mt-2 w-full rounded-md border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"
                >
                  <option value="">
                    {loadingUsers ? 'Loading users...' : 'Select a user'}
                  </option>
                  {users.map((workspaceUser) => (
                    <option key={workspaceUser._id} value={workspaceUser._id}>
                      {workspaceUser.name} - {workspaceUser.email}
                    </option>
                  ))}
                </select>
                {!loadingUsers && users.length === 0 && (
                  <p className="mt-2 text-xs font-medium text-amber-700">
                    No users found. Create a member account before assigning tasks.
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <input
                  id="description"
                  name="description"
                  type="text"
                  value={taskForm.description}
                  onChange={handleFormChange}
                  className="mt-2 w-full rounded-md border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                  placeholder="Optional details"
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <motion.button
                type="submit"
                disabled={creating}
                whileHover={creating ? undefined : { y: -1, scale: 1.01 }}
                whileTap={creating ? undefined : { scale: 0.98 }}
                className="inline-flex items-center gap-2 rounded-md bg-slate-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
              >
                {creating && <Loader2 className="h-4 w-4 animate-spin" />}
                {creating ? 'Creating...' : 'Create Task'}
              </motion.button>
            </div>
          </motion.form>
          )}
        </AnimatePresence>

        <motion.div className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm" variants={itemVariants} initial="hidden" animate="show">
          <div className="flex flex-col gap-5 border-b border-slate-200 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-950">Tasks</h2>
              <p className="mt-1 text-sm text-slate-500">
                {isAdmin ? 'All workspace tasks' : 'Tasks assigned to you'}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px] lg:w-[520px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-md border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
                  placeholder="Search title or description"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm font-semibold capitalize text-slate-800 outline-none transition hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              >
                {filterOptions.map((status) => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All' : formatStatus(status)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 px-6 py-16 text-sm font-medium text-slate-600">
              <Loader2 className="h-5 w-5 animate-spin text-teal-600" />
              Loading tasks...
            </div>
          ) : tasks.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <h3 className="text-lg font-semibold text-slate-950">No tasks yet</h3>
              <p className="mt-2 text-sm text-slate-600">Tasks will appear here once they are created or assigned.</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-16 text-center"
            >
              <h3 className="text-lg font-semibold text-slate-950">No tasks found</h3>
              <p className="mt-2 text-sm text-slate-600">Try a different search term or status filter.</p>
            </motion.div>
          ) : (
            <motion.div className="divide-y divide-slate-200" variants={listVariants} initial="hidden" animate="show">
              {filteredTasks.map((task) => (
                <motion.article key={task._id} variants={itemVariants} layout className="p-6 transition hover:bg-slate-50">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-lg font-bold text-slate-950">{task.title}</h3>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${statusStyles[task.status]}`}>
                          {formatStatus(task.status)}
                        </span>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {task.description || 'No description provided.'}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2 text-sm text-slate-500">
                        <span className="rounded-md bg-slate-100 px-3 py-1">
                          Assigned to: {task.assignedTo?.name || 'Unknown user'}
                        </span>
                        {task.assignedTo?.email && (
                          <span className="rounded-md bg-slate-100 px-3 py-1">{task.assignedTo.email}</span>
                        )}
                      </div>
                    </div>

                    <div className="w-full lg:w-48">
                      <div className="flex items-center justify-between">
                        <label htmlFor={`status-${task._id}`} className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                          Update Status
                        </label>
                        {updatingTaskId === task._id && <Loader2 className="h-4 w-4 animate-spin text-teal-600" />}
                      </div>
                      <select
                        id={`status-${task._id}`}
                        value={task.status}
                        disabled={updatingTaskId === task._id}
                        onChange={(event) => handleStatusChange(task._id, event.target.value)}
                        className={`mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold capitalize text-slate-800 outline-none transition hover:border-slate-400 focus:border-teal-600 focus:ring-4 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-100 ${updatingTaskId === task._id ? 'ring-4 ring-teal-100' : ''}`}
                      >
                        {statuses.map((status) => (
                          <option key={status} value={status}>
                            {formatStatus(status)}
                          </option>
                        ))}
                      </select>
                      {isAdmin && (
                        <motion.button
                          type="button"
                          onClick={() => handleDeleteTask(task._id)}
                          disabled={updatingTaskId === task._id}
                          whileHover={updatingTaskId === task._id ? undefined : { y: -1 }}
                          whileTap={updatingTaskId === task._id ? undefined : { scale: 0.98 }}
                          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          )}
        </motion.div>
      </section>
    </motion.main>
  );
}

export default Dashboard;
