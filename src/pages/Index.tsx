
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, FileText, MessageSquare, Activity, Settings, Stethoscope, Pill } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { captureEvent } from "@/integrations/posthog/config";

const Index = () => {
  useEffect(() => {
    // Manually capture the pageview for the home page
    captureEvent('page_view', { page: 'home' });
  }, []);

  const quickActions = [
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Book Session",
      color: "bg-blue-100 hover:bg-blue-200",
      textColor: "text-blue-800",
      link: "/sessions",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Patients",
      color: "bg-green-100 hover:bg-green-200", 
      textColor: "text-green-800",
      link: "/patients",
    },
    {
      icon: <FileText className="h-5 w-5" />,
      label: "Forms",
      color: "bg-purple-100 hover:bg-purple-200",
      textColor: "text-purple-800",
      link: "/forms",
    },
    {
      icon: <MessageSquare className="h-5 w-5" />,
      label: "Messages",
      color: "bg-orange-100 hover:bg-orange-200",
      textColor: "text-orange-800",
      link: "/messages",
    },
    {
      icon: <Activity className="h-5 w-5" />,
      label: "Dashboard",
      color: "bg-pink-100 hover:bg-pink-200",
      textColor: "text-pink-800",
      link: "/dashboard",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Settings",
      color: "bg-gray-100 hover:bg-gray-200",
      textColor: "text-gray-800",
      link: "/settings",
    },
    {
      icon: <Stethoscope className="h-5 w-5" />,
      label: "Providers",
      color: "bg-teal-100 hover:bg-teal-200",
      textColor: "text-teal-800",
      link: "/providers",
    },
    {
      icon: <Pill className="h-5 w-5" />,
      label: "Products",
      color: "bg-indigo-100 hover:bg-indigo-200",
      textColor: "text-indigo-800",
      link: "/products",
    }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
      <div className="text-center space-y-8 px-4">
        <div className="relative">
          <div className="p-16">
            <img 
              src="\images\Zappycare.png"  
              alt="Zappy Care Logo" 
              className="w-72 h-72 object-contain"
            />
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-4">
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
            {quickActions.slice(0, 4).map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={action.link}>
                  <Button 
                    className={`${action.color} ${action.textColor} rounded-full p-3 shadow-lg flex items-center gap-2 transition-transform hover:scale-110`}
                    onClick={() => captureEvent('quick_action_click', { action: action.label })}
                  >
                    {action.icon}
                    <span className="font-medium">{action.label}</span>
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl">
            {quickActions.slice(4).map((action, index) => (
              <motion.div
                key={action.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={action.link}>
                  <Button 
                    className={`${action.color} ${action.textColor} rounded-full p-3 shadow-lg flex items-center gap-2 transition-transform hover:scale-110`}
                    onClick={() => captureEvent('quick_action_click', { action: action.label })}
                  >
                    {action.icon}
                    <span className="font-medium">{action.label}</span>
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-orange-700 bg-clip-text text-transparent">
            Welcome to Zappy Care
          </h1>
          <p className="text-gray-700 max-w-md mx-auto">
            Your comprehensive healthcare management solution. Choose an action to get started or visit the dashboard for a complete overview.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
