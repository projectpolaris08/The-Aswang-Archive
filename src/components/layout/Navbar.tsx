import React, { useState, useEffect, useRef, useCallback } from "react";
import { Menu, X, Search, LogOut, Bell, UserCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

interface NavbarProps {
  user?: any;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [pendingCount, setPendingCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const notifDropdownRef = useRef(null);

  // Helper to check if user is admin
  const isAdmin = user?.user_metadata?.is_admin;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (user?.user_metadata?.is_admin) {
      // Fetch pending stories count from Supabase
      supabase
        .from("stories")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending")
        .then(({ count }) => setPendingCount(count || 0));
    }
  }, [user]);

  // Fetch notifications and unread count
  const fetchNotifications = useCallback(async () => {
    if (!user) return;
    if (isAdmin) {
      // Admin: fetch pending stories
      const { data } = await supabase
        .from("stories")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      setNotifications(data || []);
      setNotifCount(data ? data.length : 0);
    } else {
      // User: fetch their notifications
      let query = supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false });
      query = query.eq("user_id", user.id).in("type", ["approved", "rejected"]);
      const { data } = await query;
      setNotifications(data || []);
      setNotifCount(data ? data.filter((n) => !n.read).length : 0);
    }
  }, [user, isAdmin]);

  useEffect(() => {
    fetchNotifications();
  }, [user, fetchNotifications]);

  // Poll for new notifications every 10 seconds
  useEffect(() => {
    if (!user) return;
    const interval = setInterval(async () => {
      if (isAdmin) {
        const { data } = await supabase
          .from("stories")
          .select("*")
          .eq("status", "pending")
          .order("created_at", { ascending: false });
        if (data && data.length > notifications.length) {
          setToast("New story submitted for review.");
          setTimeout(() => setToast(null), 4000);
          setNotifications(data);
          setNotifCount(data.length);
        }
      } else {
        let query = supabase
          .from("notifications")
          .select("*")
          .order("created_at", { ascending: false });
        query = query
          .eq("user_id", user.id)
          .in("type", ["approved", "rejected"]);
        const { data } = await query;
        if (data && data.length > notifications.length) {
          const newNotif = data.find(
            (n) => !notifications.some((old) => old.id === n.id)
          );
          if (newNotif) {
            setToast(newNotif.message);
            setTimeout(() => setToast(null), 4000);
          }
          setNotifications(data);
          setNotifCount(data.filter((n) => !n.read).length);
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [user, notifications, isAdmin]);

  // Click outside to close notification dropdown
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        (notifDropdownRef.current as any) &&
        (notifDropdownRef.current as any).contains(event.target)
      ) {
        return;
      }
      setShowNotifDropdown(false);
    }
    if (showNotifDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifDropdown]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Creatures", path: "/creatures" },
    { name: "Shamans & Healers", path: "/shamans-healers" },
    { name: "Stories", path: "/stories" },
    { name: "Regions", path: "/regions" },
    { name: "About", path: "/about" },
  ];

  // Auth links
  const authLinks = (
    <>
      {user ? (
        <>
          <span
            className="text-gray-100 text-sm mr-1 truncate max-w-[90px]"
            title={user.user_metadata?.username || user.email || user.username}
          >
            {(() => {
              const rawName =
                user.user_metadata?.username ||
                user.email ||
                user.username ||
                "";
              return rawName.charAt(0).toUpperCase() + rawName.slice(1);
            })()}
          </span>
          <Link
            to="/submit"
            className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors ml-1"
          >
            Create
          </Link>
          <button
            onClick={onLogout}
            className="p-2 rounded bg-red-600 text-white hover:bg-red-700 ml-1"
            aria-label="Logout"
          >
            <LogOut size={16} />
          </button>
        </>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="px-3 py-1 rounded bg-red-600 text-white text-xs font-semibold hover:bg-red-700 transition-colors ml-1"
        >
          Login
        </button>
      )}
    </>
  );

  // Debug print for user object
  useEffect(() => {
    console.log("User object:", user);
  }, [user]);

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-gray-900 shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <img
              src="/white-witch.png"
              alt="The Aswang Archive Logo"
              className="h-8 w-8 mr-2 transition duration-300 group-hover:filter group-hover:invert-14 group-hover:sepia group-hover:saturate-500 group-hover:hue-rotate-[-50deg] group-hover:brightness-100 group-hover:contrast-100 group-hover:drop-shadow-[0_0_4px_rgba(229,62,62,0.7)]"
              style={{ filter: "none" }}
            />
            <span className="font-serif text-xl md:text-2xl font-bold text-red-500 group-hover:text-red-400 transition-colors">
              The Aswang Archive
            </span>
          </Link>

          {/* Main Nav - Centered on desktop */}
          <nav className="hidden md:flex flex-1 justify-center items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm uppercase tracking-wider font-medium transition-colors hover:text-red-500 ${
                  location.pathname === link.path
                    ? "text-red-500"
                    : "text-gray-100"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* User Actions - Right */}
          <div className="hidden md:flex items-center space-x-2 min-w-[180px] justify-end">
            {user && (
              <Link to="/profile" className="flex items-center mr-2 group" title="Profile">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="avatar"
                    className="w-8 h-8 rounded-full border-2 border-gray-700 group-hover:border-red-500 transition-all"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-lg">
                    {user.user_metadata?.username?.[0]?.toUpperCase() || <UserCircle className="w-6 h-6" />}
                  </div>
                )}
              </Link>
            )}
            {user && (
              <div className="relative" ref={notifDropdownRef}>
                <button
                  onClick={() => setShowNotifDropdown((prev) => !prev)}
                  className="p-2 rounded bg-zinc-800 text-white hover:bg-zinc-700 ml-1 relative"
                  aria-label="Notifications"
                >
                  <Bell size={16} />
                  {notifCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
                      {notifCount}
                    </span>
                  )}
                </button>
                {showNotifDropdown && (
                  <div className="absolute right-0 mt-2 w-96 bg-zinc-900 border border-zinc-700 rounded shadow-lg z-50">
                    <div className="p-4">
                      <h2 className="text-lg font-bold mb-2 text-red-500">
                        Notifications
                      </h2>
                      {isAdmin ? (
                        pendingCount === 0 ? (
                          <div className="text-gray-400">
                            No pending stories.
                          </div>
                        ) : (
                          <ul className="space-y-2 max-h-96 overflow-y-auto">
                            {notifications.map((story) => (
                              <li
                                key={story.id}
                                className="bg-zinc-800 p-3 rounded flex items-center space-x-3 hover:bg-zinc-700 transition cursor-pointer"
                                onClick={() => navigate("/admin")}
                              >
                                {story.image_url && (
                                  <img
                                    src={story.image_url}
                                    alt="Story"
                                    className="w-12 h-12 object-cover rounded"
                                  />
                                )}
                                <div>
                                  <div className="text-sm font-semibold text-gray-100">
                                    {story.title}
                                  </div>
                                  <div className="text-xs text-gray-400 truncate max-w-[180px]">
                                    {story.content}
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )
                      ) : notifications.length === 0 ? (
                        <div className="text-gray-400">
                          No notifications yet.
                        </div>
                      ) : (
                        <ul className="space-y-2 max-h-60 overflow-y-auto">
                          {notifications.map((n) => (
                            <li
                              key={n.id}
                              className={`bg-zinc-800 p-3 rounded flex justify-between items-center ${
                                !n.read ? "border-l-4 border-red-500" : ""
                              }`}
                            >
                              <div>
                                <div className="text-sm text-gray-100">
                                  {n.message}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {new Date(n.created_at).toLocaleString()}
                                </div>
                              </div>
                              <div className="flex flex-col items-end ml-4">
                                {!n.read && (
                                  <button
                                    onClick={async () => {
                                      await supabase
                                        .from("notifications")
                                        .update({ read: true })
                                        .eq("id", n.id);
                                      fetchNotifications();
                                    }}
                                    className="text-xs text-green-400 hover:text-green-600 mb-1"
                                    title="Mark as read"
                                  >
                                    Mark as read
                                  </button>
                                )}
                                <button
                                  onClick={async () => {
                                    await supabase
                                      .from("notifications")
                                      .delete()
                                      .eq("id", n.id);
                                    fetchNotifications();
                                  }}
                                  className="text-xs text-red-400 hover:text-red-600"
                                  title="Delete notification"
                                >
                                  Delete
                                </button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                )}
                {/* Toast popup */}
                {toast && (
                  <div className="fixed bottom-6 right-6 bg-zinc-900 border border-red-600 text-white px-6 py-3 rounded shadow-lg z-[9999] animate-fade-in">
                    {toast}
                  </div>
                )}
              </div>
            )}
            {authLinks}
          </div>

          {/* Actions for mobile */}
          <div className="flex items-center space-x-4 md:hidden">
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-gray-100" />
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-full hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-100" />
              ) : (
                <Menu className="h-6 w-6 text-gray-100" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-900 shadow-xl">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm uppercase tracking-wider font-medium py-2 transition-colors hover:text-red-500 ${
                    location.pathname === link.path
                      ? "text-red-500"
                      : "text-gray-100"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              {/* Auth Links for mobile - improved UX */}
              <div className="mt-6 flex flex-col items-center space-y-3 w-full">
                {user && (
                  <span
                    className="text-gray-200 text-base font-semibold mb-3 mt-1 w-full truncate"
                    title={
                      user.user_metadata?.username ||
                      user.email ||
                      user.username
                    }
                  >
                    {(() => {
                      const rawName =
                        user.user_metadata?.username ||
                        user.email ||
                        user.username ||
                        "";
                      return rawName.charAt(0).toUpperCase() + rawName.slice(1);
                    })()}
                  </span>
                )}
                {user ? (
                  <>
                    <Link
                      to="/submit"
                      className="w-full flex items-center justify-center px-4 py-2 rounded bg-red-600 text-white text-base font-semibold hover:bg-red-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <span className="mr-2">Create</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </Link>
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center justify-center px-4 py-2 rounded bg-zinc-800 text-white text-base font-semibold hover:bg-red-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      Logout
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="w-full flex items-center justify-center px-4 py-2 rounded bg-red-600 text-white text-base font-semibold hover:bg-red-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                  >
                    Login
                  </button>
                )}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="bg-gray-900 shadow-xl py-4">
          <div className="container mx-auto px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for creatures, stories, regions..."
                className="w-full px-4 py-2 bg-gray-800 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-5 w-5 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
