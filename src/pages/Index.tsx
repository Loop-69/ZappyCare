
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Users, BriefcaseBusiness } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { captureEvent } from "@/integrations/posthog/config";
import { supabase } from "@/integrations/supabase/client"; // Assuming supabase client is here

const Index = () => {
  const [user, setUser] = useState<any>(null); // State to hold authenticated user
  const [userRole, setUserRole] = useState<string | null>(null); // State to hold user role
  const [loading, setLoading] = useState(true); // State for loading user data
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndRole = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Assuming a 'profiles' table with 'id' and 'role' columns
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error("Error fetching user role:", error);
          setUserRole(null);
        } else if (data) {
          setUserRole(data.role);
        }
      }
      setLoading(false);
    };

    fetchUserAndRole();

    // Manually capture the pageview for the home page
    captureEvent('page_view', { page: 'home' });
  }, []);

  const handlePatientClick = () => {
    captureEvent('home_bubble_click', { type: 'patient' });
    if (user && userRole === 'patient') {
      navigate('/patients-dashboard'); // Navigate to patient dashboard if authenticated patient
    } else if (user && userRole !== 'patient') {
      // Optionally show a message or redirect to a different page for authenticated non-patients
      navigate('/patients-dashboard'); // Or redirect to a page explaining access
    }
     else {
      navigate('/patients-dashboard'); // Navigate to patient dashboard for unauthenticated users
    }
  };

  const handleStaffClick = () => {
    captureEvent('home_bubble_click', { type: 'staff' });
    if (user && userRole === 'staff') {
      navigate('/dashboard'); // Navigate to admin dashboard if authenticated staff
    } else if (user && userRole !== 'staff') {
       // Optionally show a message or redirect to a different page for authenticated non-staff
       navigate('/dashboard'); // Or redirect to a page explaining access
    }
    else {
      navigate('/dashboard'); // Navigate to admin dashboard for unauthenticated users
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
        {/* Loading indicator or spinner */}
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="relative mb 0"> {/* Reduced bottom margin */}
          <div className="relative p-1"> {/* Slightly reduced padding */}
            {/* Bubble background */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-64 h-64 rounded-full bg-blue-100 opacity-30 blur-xl"></div>
              <div className="absolute w-56 h-56 rounded-full bg-purple-100 opacity-30 blur-xl -top-8 -left-8"></div>
              <div className="absolute w-48 h-48 rounded-full bg-orange-100 opacity-30 blur-xl -bottom-8 -right-8"></div>
            </div>
            
            {/* Logo */}
            <img 
              src="\images\Zappycare.png"  
              alt="Zappy Care Logo" 
              className="relative w-80 h-80 object-contain z-10"
            />
          </div>
        </div>
        
        <div className="flex justify-center gap-8 w-full max-w-2xl">
          {/* Patient Bubble */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center space-y-4 p-8 bg-white rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={handlePatientClick}
          >
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-blue-100 text-blue-800">
              <Users className="h-12 w-12" />
            </div>
            <span className="text-lg font-medium text-gray-800">Patients</span>
          </motion.div>

          {/* Staff Bubble */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center space-y-4 p-8 bg-white rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
            onClick={handleStaffClick}
          >
            <div className="flex items-center justify-center w-24 h-24 rounded-full bg-green-100 text-green-800">
              <BriefcaseBusiness className="h-12 w-12" />
            </div>
            <span className="text-lg font-medium text-gray-800">Staff</span>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 bg-white border-t border-gray-200">
        <div className="text-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent mb-2">
            Welcome to Zappy Care
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Your comprehensive healthcare management solution. Please select your role to proceed.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
