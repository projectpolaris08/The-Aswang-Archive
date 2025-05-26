import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }
      // Fetch profile
      const { data: profiles } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id);
      if (profiles && profiles[0]?.role === "admin") {
        setAllowed(true);
      } else {
        navigate("/access-denied");
      }
      setLoading(false);
    };
    checkAdmin();
  }, [navigate]);

  if (loading)
    return <div className="text-center text-white py-8">Loading...</div>;
  return allowed ? <>{children}</> : null;
};

export default AdminProtectedRoute;
