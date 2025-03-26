import React from "react";
import { Navigate, useRoutes } from "react-router";
import { paths } from "./paths";
import Register from "./pages/register";
import Login from "./pages/login";
import Profile from "./pages/profile";
import Settings from "./pages/settings";
import Home from "./pages/home";
import { useAuth } from "./hooks/useAuth";

const Router = () => {
  const { authUser } = useAuth();

  return useRoutes([
    {
      path: paths.home,
      element: authUser ? <Home /> : <Navigate to="/login" />,
    },
    {
      path: paths.register,
      element: !authUser ? <Register /> : <Navigate to="/" />,
    },
    {
      path: paths.login,
      element: !authUser ? <Login /> : <Navigate to="/" />,
    },
    {
      path: paths.profile,
      element: authUser ? <Profile /> : <Navigate to="/login" />,
    },
    {
      path: paths.settings,
      element: <Settings />,
    },
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
};

export default Router;
