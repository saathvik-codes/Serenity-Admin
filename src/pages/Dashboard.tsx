import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  Users, 
  MessageSquare, 
  Heart, 
  Activity,
  Calendar,
  AlertCircle,
  Search,
  Filter
} from 'lucide-react';
import { formatDate } from '../lib/utils';
import Sidebar from '../components/Sidebar';
import UserManagement from './UserManagement';
import CommunityModeration from './CommunityModeration';
import Analytics from './Analytics';

interface Stats {
  totalUsers: number;
  totalDiscussions: number;
  totalSupportGroups: number;
  activeUsers: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  createdAt: any;
  wellness_score: number;
  streak: number;
  emailVerified?: boolean;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalDiscussions: 0,
    totalSupportGroups: 0,
    activeUsers: 0,
  });
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const users = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];

      // Load discussions
      const discussionsSnapshot = await getDocs(collection(db, 'community_discussions'));
      
      // Load support groups
      const groupsSnapshot = await getDocs(collection(db, 'support_groups'));

      // Calculate stats
      setStats({
        totalUsers: users.length,
        totalDiscussions: discussionsSnapshot.size,
        totalSupportGroups: groupsSnapshot.size,
        activeUsers: users.filter(u => u.streak > 0).length,
      });

      // Get all users sorted by creation date
      const allUsersQuery = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc')
      );
      const allUsersSnapshot = await getDocs(allUsersQuery);
      const allUsersData = allUsersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      
      setAllUsers(allUsersData);
      setFilteredUsers(allUsersData);
      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(allUsers);
    } else {
      const filtered = allUsers.filter(user => 
        user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, allUsers]);

  if (activeTab === 'users') {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1">
          <UserManagement users={allUsers} onRefresh={loadDashboardData} />
        </div>
      </div>
    );
  }

  if (activeTab === 'community') {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1">
          <CommunityModeration />
        </div>
      </div>
    );
  }

  if (activeTab === 'analytics') {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1">
          <Analytics />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 divide-x divide-y divide-border overflow-hidden rounded-xl border border-border bg-card lg:grid-cols-4 lg:divide-y-0">
          {[
            { label: 'Registered users', value: stats.totalUsers, icon: Users },
            { label: 'Active users', value: stats.activeUsers, icon: Activity },
            { label: 'Discussions', value: stats.totalDiscussions, icon: MessageSquare },
            { label: 'Support groups', value: stats.totalSupportGroups, icon: Heart },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                {label}
              </div>
              <p className="mt-3 font-display text-4xl font-semibold text-foreground">{Number(value || 0).toLocaleString()}</p>
            </div>
          ))}
        </div>

        {/* All Users Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-purple-600" />
                <span className="truncate">All Users ({filteredUsers.length})</span>
              </h2>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wellness Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Streak
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold bg-primary">
                            {user.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name || 'Unknown'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{user.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-sm font-medium text-gray-900">{user.wellness_score || 0}</div>
                          <div className="ml-2 text-xs text-gray-500">/ 100</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-foreground">{user.streak || 0} {(user.streak || 0) === 1 ? "day" : "days"}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                      <p>{searchQuery ? 'No users match your search' : 'No users found'}</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
