import React, { useState, useEffect } from "react";
import { LogOut, Plus } from "lucide-react";
import { useAuth } from "./AuthProvider";

const Dashboard = ({ onNavigate }: { onNavigate: (route: string) => void }) => {
  const { logout, user } = useAuth();
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    // Load tickets from localStorage
    const stored = localStorage.getItem("ticketapp_tickets");
    if (stored) {
      try {
        setTickets(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading tickets:", e);
        setTickets([]);
      }
    }
  }, []);

  // Calculate statistics
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === "open").length,
    inProgress: tickets.filter((t) => t.status === "in_progress").length,
    closed: tickets.filter((t) => t.status === "closed").length,
  };

  const handleLogout = () => {
    logout();
    onNavigate("landing");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">TicketFlow</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 text-sm hidden sm:inline">
              {user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md hover:shadow-lg"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Dashboard Overview
        </h2>

        {/* Statistics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Tickets */}
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition">
            <div className="text-gray-600 text-sm font-medium mb-2">
              Total Tickets
            </div>
            <div className="text-4xl font-bold text-gray-800">
              {stats.total}
            </div>
            <div className="mt-2 text-xs text-gray-500">All time</div>
          </div>

          {/* Open Tickets */}
          <div className="bg-green-50 p-6 rounded-xl shadow-md border-l-4 border-green-500 hover:shadow-lg transition">
            <div className="text-green-700 text-sm font-medium mb-2">Open</div>
            <div className="text-4xl font-bold text-green-700">
              {stats.open}
            </div>
            <div className="mt-2 text-xs text-green-600">Awaiting action</div>
          </div>

          {/* In Progress Tickets */}
          <div className="bg-amber-50 p-6 rounded-xl shadow-md border-l-4 border-amber-500 hover:shadow-lg transition">
            <div className="text-amber-700 text-sm font-medium mb-2">
              In Progress
            </div>
            <div className="text-4xl font-bold text-amber-700">
              {stats.inProgress}
            </div>
            <div className="mt-2 text-xs text-amber-600">Being worked on</div>
          </div>

          {/* Closed Tickets */}
          <div className="bg-gray-100 p-6 rounded-xl shadow-md border-l-4 border-gray-500 hover:shadow-lg transition">
            <div className="text-gray-700 text-sm font-medium mb-2">Closed</div>
            <div className="text-4xl font-bold text-gray-700">
              {stats.closed}
            </div>
            <div className="mt-2 text-xs text-gray-600">Resolved</div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Quick Actions
          </h3>
          <p className="text-gray-600 mb-6">
            Manage your support tickets efficiently. Create, edit, and track all
            your tickets in one place.
          </p>
          <button
            onClick={() => onNavigate("tickets")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md hover:shadow-lg flex items-center gap-2 transform hover:scale-105"
          >
            <Plus size={20} /> Manage Tickets
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6 mt-16">
        <div className="max-w-screen-xl mx-auto px-4 text-center">
          <p className="text-gray-300">
            &copy; 2025 TicketFlow. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
