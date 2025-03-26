import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Settings, Database, BarChart4, LayoutDashboard, Newspaper } from 'lucide-react';

const AdminNavLinks: React.FC = () => {
  const location = useLocation();

  return (
    <ul className="space-y-2">
      <li>
        <Link
          to="/admin/dashboard"
          className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
            location.pathname === '/admin/dashboard' ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <LayoutDashboard className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          <span className="ml-3">Dashboard</span>
        </Link>
      </li>
      <li>
        <Link
          to="/admin/user-management"
          className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
            location.pathname === '/admin/user-management' ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <Users className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          <span className="ml-3">Utilisateurs</span>
        </Link>
      </li>
      <li>
        <Link
          to="/admin/pocketbase"
          className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
            location.pathname === '/admin/pocketbase' ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <BarChart4 className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          <span className="ml-3">PocketBase</span>
        </Link>
      </li>
      <li>
        <Link
          to="/admin/news"
          className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
            location.pathname.startsWith('/admin/news') ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <Newspaper className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          <span className="ml-3">Actualités</span>
        </Link>
      </li>
      <li>
        <Link
          to="/admin/settings"
          className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
            location.pathname.startsWith('/admin/settings') ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <Settings className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          <span className="ml-3">Paramètres</span>
        </Link>
      </li>
      
      <li>
        <Link
          to="/admin/database-explorer"
          className={`flex items-center p-2 text-base font-normal rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 ${
            location.pathname === '/admin/database-explorer' ? 'bg-gray-100 dark:bg-gray-700' : ''
          }`}
        >
          <Database className="w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          <span className="ml-3">Explorateur BDD</span>
        </Link>
      </li>
    </ul>
  );
};

export default AdminNavLinks;
