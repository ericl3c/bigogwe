import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  CheckCircle,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Mail,
  MessageSquare,
  Trash2,
  Users,
  UserPlus,
} from "lucide-react";

import { apiRequest, apiUrl, clearAuth, getStoredAuth } from "../../utils/adminApi";
import "../../css/admin.css";

const getTodayInputValue = () => {
  const today = new Date();
  const offset = today.getTimezoneOffset();
  return new Date(today.getTime() - offset * 60000).toISOString().slice(0, 10);
};

export default function AdminDashboard() {

  const navigate = useNavigate();
  const auth = getStoredAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [galleryForm, setGalleryForm] = useState({
    photo: null,
    photoPreview: "",
    description: "",
    date_added: new Date().toISOString().slice(0, 10),
  });
  const [updatingStatusId, setUpdatingStatusId] = useState(null);
  const [bookingFilterDate, setBookingFilterDate] = useState("");
  const [bookingFilterCategory, setBookingFilterCategory] = useState("");
  const [paymentInputs, setPaymentInputs] = useState({});
  const [editingPaidId, setEditingPaidId] = useState(null);

  const bookingStatusOptions = [
    { value: "pending", label: "Pending" },
    { value: "confirmed", label: "Confirmed" },
    { value: "cancelled", label: "Cancelled" },
    { value: "completed", label: "Completed" },
  ];

  const bookingCategoryOptions = [
    { value: "child", label: "Child" },
    { value: "rwandan", label: "Rwandan" },
    { value: "eastAfrican", label: "East African Visitor" },
    { value: "international", label: "International Visitor" },
  ];

  const tabCopy = {
    bookings: {
      title: "Booking Management",
      description: "View and manage visitor booking requests",
    },
    gallery: {
      title: "Gallery Management",
      description: "Add and remove gallery images for the website",
    },
    messages: {
      title: "Message Management",
      description: "Read and manage Contact Us messages from visitors",
    },
  };

  const handleUpdateBookingStatus = async (id, status) => {
    if (!id) return;
    setUpdatingStatusId(id);
    const previousBookings = [...bookings];

    try {
      setBookings((prev) =>
        prev.map((booking) =>
          booking.booking_id === id ? { ...booking, status } : booking
        )
      );

      await apiRequest(`/bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status }),
      });

      showMessage("success", `Booking status updated to ${status}`);
    } catch (err) {
      setBookings(previousBookings);
      showMessage("error", err.message);
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleAddPayment = async (id, amount) => {
    if (!id) return;
    const value = Number(amount || 0);
    if (isNaN(value) || value <= 0) {
      showMessage("error", "Enter a valid payment amount");
      return;
    }

    try {
      // Optimistically update UI
      setBookings((prev) => prev.map((b) => b.booking_id === id ? { ...b, amount_paid: (Number(b.amount_paid || 0) + value) } : b));

      await apiRequest(`/bookings/${id}`, {
        method: "PUT",
        body: JSON.stringify({ amount_paid_delta: value }),
      });

      showMessage("success", "Payment recorded");
      // clear input
      setPaymentInputs((p) => ({ ...p, [id]: "" }));
    } catch (err) {
      showMessage("error", err.message);
      // reload data to correct UI
      loadData();
    }
  };

  useEffect(() => {
    if (!auth?.token || auth.user?.role !== "ceo") {
      navigate("/admin/login");
      return;
    }
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const showMessage = (type, text) => {
    setMessageType(type);
    setMessage(text);
    setTimeout(() => setMessage(""), 3500);
  };

  const loadData = async () => {
    setLoading(true);
    try {
      const [bookingsData, galleryData, contactsData] = await Promise.all([
        apiRequest("/bookings"),
        apiRequest("/gallery"),
        apiRequest("/contacts"),
      ]);
      setBookings(bookingsData);
      setGallery(galleryData);
      setContactMessages(contactsData);
    } catch (err) {
      if (err.message.includes("Authentication") || err.message.includes("token")) {
        clearAuth();
        navigate("/admin/login");
        return;
      }
      showMessage("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/admin/login");
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await apiRequest(`/bookings/${id}`, { method: "DELETE" });
      setBookings((prev) => prev.filter((b) => b.booking_id !== id));
      showMessage("success", "Booking deleted");
    } catch (err) {
      showMessage("error", err.message);
    }
  };

  const todayInputValue = getTodayInputValue();
  const upcomingBookings = bookings.filter(
    (booking) => String(booking.booking_date || "") >= todayInputValue
  );
  const filteredBookings = upcomingBookings.filter((booking) => {
    const matchesDate = bookingFilterDate
      ? booking.booking_date === bookingFilterDate
      : true;
    const matchesCategory = bookingFilterCategory
      ? booking.visitor_category === bookingFilterCategory
      : true;

    return matchesDate && matchesCategory;
  });

  const handleDeleteGallery = async (id) => {
    if (!window.confirm("Delete this gallery image?")) return;
    try {
      await apiRequest(`/gallery/${id}`, { method: "DELETE" });
      setGallery((prev) => prev.filter((g) => g.id !== id));
      showMessage("success", "Gallery entry deleted");
    } catch (err) {
      showMessage("error", err.message);
    }
  };

  const handleDeleteContactMessage = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await apiRequest(`/contacts/${id}`, { method: "DELETE" });
      setContactMessages((prev) => prev.filter((item) => item.contact_id !== id));
      showMessage("success", "Message deleted");
    } catch (err) {
      showMessage("error", err.message);
    }
  };

  const handleGallerySubmit = async (e) => {
    e.preventDefault();
    
    if (!galleryForm.photo) {
      showMessage("error", "Please select a photo to upload");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("photo", galleryForm.photo);
      formData.append("description", galleryForm.description);
      formData.append("date_added", galleryForm.date_added);

      const auth = getStoredAuth();
      const response = await fetch(apiUrl("/gallery"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${auth?.token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setGallery((prev) => [data.entry, ...prev]);
      setGalleryForm({
        photo: null,
        photoPreview: "",
        description: "",
        date_added: new Date().toISOString().slice(0, 10),
      });
      showMessage("success", "Gallery image added successfully");
    } catch (err) {
      showMessage("error", err.message);
    }
  };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">
          <LayoutDashboard size={24} />
          <div>
            <strong>Bigogwe Admin</strong>
            <span>Developer Dashboard</span>
          </div>
        </div>

        <nav className="admin-nav">
          <button
            type="button"
            className={activeTab === "bookings" ? "active" : ""}
            onClick={() => setActiveTab("bookings")}
          >
            <Users size={18} />
            Manage Bookings
          </button>
          <button
            type="button"
            className={activeTab === "gallery" ? "active" : ""}
            onClick={() => setActiveTab("gallery")}
          >
            <ImagePlus size={18} />
            Gallery
          </button>
          <button
            type="button"
            className={activeTab === "messages" ? "active" : ""}
            onClick={() => setActiveTab("messages")}
          >
            <Mail size={18} />
            Messages
          </button>
          <button
            type="button"
            className={activeTab === "register" ? "active" : ""}
            onClick={() => navigate("/admin/register")}
          >
            <UserPlus size={18} />
            Create Admins
          </button>
        </nav>


        <div className="admin-sidebar-footer">
          <p>{auth?.user?.name_user}</p>
          <button type="button" className="admin-btn admin-btn-ghost" onClick={handleLogout}>
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>{tabCopy[activeTab]?.title || "Admin Dashboard"}</h1>
            <p>{tabCopy[activeTab]?.description || "Manage website content"}</p>
          </div>
          <div className="admin-stats">
            <div className="admin-stat-card">
              <Users size={20} />
              <span>{upcomingBookings.length} future bookings</span>
            </div>
            <div className="admin-stat-card">
              <Calendar size={20} />
              <span>{gallery.length} gallery items</span>
            </div>
            <div className="admin-stat-card">
              <MessageSquare size={20} />
              <span>{contactMessages.length} messages</span>
            </div>
          </div>
        </header>

        {message && (
          <div className={`admin-alert admin-alert-${messageType}`}>{message}</div>
        )}

        {loading ? (
          <div className="admin-loading">Loading dashboard...</div>
        ) : activeTab === "bookings" ? (
          <section className="admin-panel">
            <div className="admin-table-filter">
              <label>
                Filter by booking date:
                <input
                  type="date"
                  value={bookingFilterDate}
                  onChange={(e) => setBookingFilterDate(e.target.value)}
                  min={todayInputValue}
                />
              </label>
              <label>
                Filter by category:
                <select
                  value={bookingFilterCategory}
                  onChange={(e) => setBookingFilterCategory(e.target.value)}
                >
                  <option value="">All categories</option>
                  {bookingCategoryOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                className="admin-btn admin-btn-secondary"
                onClick={() => {
                  setBookingFilterDate("");
                  setBookingFilterCategory("");
                }}
                disabled={!bookingFilterDate && !bookingFilterCategory}
              >
                Clear Filters
              </button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Paid</th>
                    <th>Total</th>
                    <th>Remaining</th>
                    <th>Category</th>
                    <th>Activity</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan="12" className="admin-empty">
                        No future bookings match these filters.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((booking) => (
                      <tr key={booking.booking_id}>
                        <td data-label="ID">{booking.booking_id}</td>
                        <td data-label="Name">{booking.fullname}</td>
                        <td data-label="Email">{booking.email_address}</td>
                        <td data-label="Phone">{booking.phone_number}</td>
                        <td
                          data-label="Paid"
                          className="admin-payment-cell"
                          onClick={() => setEditingPaidId(editingPaidId === booking.booking_id ? null : booking.booking_id)}
                        >
                          {editingPaidId === booking.booking_id ? (
                            <div className="admin-payment-editor">
                              <input
                                type="number"
                                min="1"
                                placeholder="Amount"
                                value={paymentInputs[booking.booking_id] || ''}
                                onChange={(e) => setPaymentInputs(p => ({ ...p, [booking.booking_id]: e.target.value }))}
                                autoFocus
                              />
                              <button
                                type="button"
                                className="admin-btn admin-btn-secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddPayment(booking.booking_id, paymentInputs[booking.booking_id]);
                                  setEditingPaidId(null);
                                }}
                              >
                                Add
                              </button>
                            </div>
                          ) : (
                            <span className="admin-payment-amount">
                              {(booking.amount_paid || 0).toLocaleString()} RWF
                            </span>
                          )}
                        </td>
                        <td data-label="Total">
                          {(() => {
                            const prices = { child:15000, rwandan:30000, eastAfrican:35000, international:40000 };
                            const people = booking.number_of_visitors || 1;
                            const total = prices[booking.visitor_category] ? prices[booking.visitor_category] * Number(people) : 0;
                            return total.toLocaleString() + ' RWF';
                          })()}
                        </td>
                        <td data-label="Remaining">
                          {(() => {
                            const prices = { child:15000, rwandan:30000, eastAfrican:35000, international:40000 };
                            const people = booking.number_of_visitors || 1;
                            const total = prices[booking.visitor_category] ? prices[booking.visitor_category] * Number(people) : 0;
                            const remaining = Math.max(0, total - (booking.amount_paid || 0));
                            return remaining.toLocaleString() + ' RWF';
                          })()}
                        </td>
                        <td data-label="Category">{booking.visitor_category}</td>
                        <td data-label="Activity">{booking.select_activities}</td>
                        <td data-label="Date">{booking.booking_date}</td>
                        <td data-label="Status">
                          <div className="status-cell">
                            <select
                              value={booking.status || "pending"}
                              onChange={(e) => handleUpdateBookingStatus(booking.booking_id, e.target.value)}
                              disabled={updatingStatusId === booking.booking_id}
                            >
                              {bookingStatusOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                            {booking.status && booking.status !== "pending" && (
                              <CheckCircle size={16} className="status-check-icon" />
                            )}
                          </div>
                        </td>
                        <td data-label="Actions">
                          <button
                            type="button"
                            className="admin-icon-btn admin-icon-btn-danger"
                            onClick={() => handleDeleteBooking(booking.booking_id)}
                            title="Delete booking"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : activeTab === "gallery" ? (
          <section className="admin-panel admin-gallery-panel">
            <form className="admin-gallery-form" onSubmit={handleGallerySubmit}>
              <h2>Add Gallery Image</h2>
              <div className="admin-form-grid">
                <label>
                  Upload Photo
                  <div className="admin-file-input-wrap">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const preview = URL.createObjectURL(file);
                          setGalleryForm((prev) => ({
                            ...prev,
                            photo: file,
                            photoPreview: preview,
                          }));
                        }
                      }}
                    />
                    {galleryForm.photoPreview && (
                      <img src={galleryForm.photoPreview} alt="Preview" className="admin-photo-preview" />
                    )}
                  </div>
                </label>
                <label>
                  Date Added
                  <input
                    type="date"
                    value={galleryForm.date_added}
                    onChange={(e) =>
                      setGalleryForm((prev) => ({ ...prev, date_added: e.target.value }))
                    }
                    required
                  />
                </label>
                <label className="admin-form-full">
                  Description
                  <textarea
                    value={galleryForm.description}
                    onChange={(e) =>
                      setGalleryForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    placeholder="Describe this gallery image..."
                    rows={3}
                  />
                </label>
              </div>
              <button type="submit" className="admin-btn admin-btn-primary">
                <ImagePlus size={18} />
                Add to Gallery
              </button>
            </form>

            <div className="admin-gallery-grid">
              {gallery.length === 0 ? (
                <p className="admin-empty">No gallery images yet. Add one above.</p>
              ) : (
                gallery.map((item) => (
                  <article key={item.id} className="admin-gallery-card">
                    <img src={item.image} alt={item.description || "Gallery"} />
                    <div className="admin-gallery-card-body">
                      <p>{item.description || "No description"}</p>
                      <small>{item.date_added}</small>
                      <button
                        type="button"
                        className="admin-btn admin-btn-danger admin-btn-sm"
                        onClick={() => handleDeleteGallery(item.id)}
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
        ) : (
          <section className="admin-panel">
            <div className="admin-messages-list">
              {contactMessages.length === 0 ? (
                <p className="admin-empty">No contact messages yet.</p>
              ) : (
                contactMessages.map((item) => (
                  <article className="admin-message-card" key={item.contact_id}>
                    <div className="admin-message-card-header">
                      <div>
                        <h2>{item.subject}</h2>
                        <p>
                          From <strong>{item.fullname}</strong>
                          {item.createdAt ? ` on ${new Date(item.createdAt).toLocaleString()}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="admin-icon-btn admin-icon-btn-danger"
                        onClick={() => handleDeleteContactMessage(item.contact_id)}
                        title="Delete message"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="admin-message-contact">
                      <a href={`mailto:${item.email_address}`}>
                        <Mail size={15} />
                        {item.email_address}
                      </a>
                      {item.phone_number && (
                        <a href={`tel:${item.phone_number.replace(/\s/g, "")}`}>
                          {item.phone_number}
                        </a>
                      )}
                    </div>

                    <p className="admin-message-body">{item.message}</p>
                  </article>
                ))
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
