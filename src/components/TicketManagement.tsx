import React, { useState, useEffect } from "react";
import { LogOut, Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { useAuth } from "./AuthProvider";
import Toast from "./Toast";

interface Ticket {
  id: number;
  title: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  title: string;
  description: string;
  status: "open" | "in_progress" | "closed";
  priority: "low" | "medium" | "high";
}

interface ToastState {
  message: string;
  type: "success" | "error" | "warning" | "info";
}

interface TicketManagementProps {
  onNavigate: (route: string) => void;
}

const TicketManagement: React.FC<TicketManagementProps> = ({ onNavigate }) => {
  const { logout, user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    status: "open",
    priority: "medium",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<ToastState | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load tickets on component mount
  useEffect(() => {
    const stored = localStorage.getItem("ticketapp_tickets");
    if (stored) {
      try {
        setTickets(JSON.parse(stored));
      } catch (e) {
        console.error("Error loading tickets:", e);
        setToast({
          message: "Failed to load tickets. Please refresh the page.",
          type: "error",
        });
        setTickets([]);
      }
    }
  }, []);

  // Save tickets to localStorage
  const saveTickets = (newTickets: Ticket[]) => {
    try {
      localStorage.setItem("ticketapp_tickets", JSON.stringify(newTickets));
      setTickets(newTickets);
    } catch (e) {
      console.error("Error saving tickets:", e);
      setToast({
        message: "Failed to save tickets. Please try again.",
        type: "error",
      });
    }
  };

  // Validate form data
  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }

    if (!["open", "in_progress", "closed"].includes(formData.status)) {
      newErrors.status = "Status must be: open, in_progress, or closed";
    }

    if (!["low", "medium", "high"].includes(formData.priority)) {
      newErrors.priority = "Priority must be: low, medium, or high";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    if (!validate()) {
      setToast({
        message: "Please fix the errors in the form",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      if (editingTicket) {
        // Update existing ticket
        const updated = tickets.map((t) =>
          t.id === editingTicket.id
            ? {
                ...formData,
                id: t.id,
                createdAt: t.createdAt,
                updatedAt: new Date().toISOString(),
              }
            : t
        );
        saveTickets(updated);
        setToast({ message: "Ticket updated successfully", type: "success" });
      } else {
        // Create new ticket
        const newTicket: Ticket = {
          ...formData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        saveTickets([...tickets, newTicket]);
        setToast({ message: "Ticket created successfully", type: "success" });
      }

      resetForm();
    } catch (error) {
      setToast({
        message: "An error occurred while saving the ticket. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle edit button click
  const handleEdit = (ticket: Ticket) => {
    setFormData({
      title: ticket.title,
      description: ticket.description || "",
      status: ticket.status,
      priority: ticket.priority || "medium",
    });
    setEditingTicket(ticket);
    setShowForm(true);
    setErrors({});

    // Scroll to form
    setTimeout(() => {
      document
        .getElementById("ticket-form")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Handle delete with confirmation
  const handleDelete = (id: number) => {
    try {
      const updated = tickets.filter((t) => t.id !== id);
      saveTickets(updated);
      setToast({ message: "Ticket deleted successfully", type: "success" });
      setDeleteConfirm(null);
    } catch (error) {
      setToast({
        message: "Failed to delete ticket. Please try again.",
        type: "error",
      });
    }
  };

  // Reset form
  const resetForm = () => {
    setShowForm(false);
    setEditingTicket(null);
    setFormData({
      title: "",
      description: "",
      status: "open",
      priority: "medium",
    });
    setErrors({});
    setIsLoading(false);
  };

  // Get status badge styling
  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "bg-green-100 text-green-800 border border-green-300";
      case "in_progress":
        return "bg-amber-100 text-amber-800 border border-amber-300";
      case "closed":
        return "bg-gray-100 text-gray-800 border border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border border-gray-300";
    }
  };

  // Format status for display
  const formatStatus = (status: string) => {
    return status.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-2">
          <h1 className="text-2xl font-bold text-blue-600">TicketFlow</h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-600 text-sm hidden md:inline">
              {user?.email}
            </span>
            <button
              onClick={() => onNavigate("dashboard")}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => {
                logout();
                onNavigate("landing");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <h2 className="text-3xl font-bold text-gray-800">
            Ticket Management
          </h2>
          <button
            onClick={() => {
              setShowForm(!showForm);
              if (showForm) resetForm();
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Plus size={18} /> New Ticket
          </button>
        </div>

        {/* Ticket Form */}
        {showForm && (
          <div
            id="ticket-form"
            className="bg-white p-6 rounded-xl shadow-lg mb-8 border-2 border-blue-200"
          >
            <h3 className="text-xl font-semibold mb-4 text-gray-800">
              {editingTicket ? "Edit Ticket" : "Create New Ticket"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title Field */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  disabled={isLoading}
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? "title-error" : undefined}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                  placeholder="Enter ticket title"
                  maxLength={100}
                />
                {errors.title && (
                  <p
                    id="title-error"
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle size={14} /> {errors.title}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1 text-right">
                  {formData.title.length}/100 characters
                </p>
              </div>

              {/* Description Field */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={isLoading}
                  aria-invalid={!!errors.description}
                  aria-describedby={
                    errors.description ? "description-error" : undefined
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none disabled:opacity-50"
                  rows={3}
                  placeholder="Describe the issue or request"
                  maxLength={500}
                />
                {errors.description && (
                  <p
                    id="description-error"
                    className="text-red-500 text-sm mt-1 flex items-center gap-1"
                    role="alert"
                  >
                    <AlertCircle size={14} /> {errors.description}
                  </p>
                )}
                <p className="text-gray-500 text-xs mt-1 text-right">
                  {formData.description.length}/500 characters
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {/* Status Field */}
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Status <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: e.target.value as
                          | "open"
                          | "in_progress"
                          | "closed",
                      })
                    }
                    disabled={isLoading}
                    aria-invalid={!!errors.status}
                    aria-describedby={
                      errors.status ? "status-error" : undefined
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                  >
                    <option value="open">Open</option>
                    <option value="in_progress">In Progress</option>
                    <option value="closed">Closed</option>
                  </select>
                  {errors.status && (
                    <p
                      id="status-error"
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      role="alert"
                    >
                      <AlertCircle size={14} /> {errors.status}
                    </p>
                  )}
                </div>

                {/* Priority Field */}
                <div>
                  <label
                    htmlFor="priority"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Priority
                  </label>
                  <select
                    id="priority"
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as "low" | "medium" | "high",
                      })
                    }
                    disabled={isLoading}
                    aria-invalid={!!errors.priority}
                    aria-describedby={
                      errors.priority ? "priority-error" : undefined
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:opacity-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                  {errors.priority && (
                    <p
                      id="priority-error"
                      className="text-red-500 text-sm mt-1 flex items-center gap-1"
                      role="alert"
                    >
                      <AlertCircle size={14} /> {errors.priority}
                    </p>
                  )}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 text-white rounded-lg transition font-medium shadow-md ${
                    isLoading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
                  }`}
                >
                  {isLoading
                    ? "Saving..."
                    : editingTicket
                    ? "Update Ticket"
                    : "Create Ticket"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={isLoading}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tickets List */}
        {tickets.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition border border-gray-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-gray-800 flex-1 pr-2">
                    {ticket.title}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getStatusColor(
                      ticket.status
                    )}`}
                  >
                    {formatStatus(ticket.status)}
                  </span>
                </div>

                {ticket.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {ticket.description}
                  </p>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500 font-medium">
                    Priority:{" "}
                    <span className="capitalize">{ticket.priority}</span>
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(ticket)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      title="Edit ticket"
                      aria-label="Edit ticket"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(ticket.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      title="Delete ticket"
                      aria-label="Delete ticket"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-md">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <AlertCircle size={32} className="text-gray-400" />
            </div>
            <p className="text-lg text-gray-600 mb-2">No tickets yet</p>
            <p className="text-gray-500">
              Create your first ticket to get started!
            </p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4"
          role="dialog"
          aria-labelledby="delete-confirmation-title"
          aria-modal="true"
        >
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full">
            <h3
              id="delete-confirmation-title"
              className="text-xl font-semibold mb-4 text-gray-800"
            >
              Confirm Delete
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this ticket? This action cannot be
              undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                autoFocus
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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

export default TicketManagement;
