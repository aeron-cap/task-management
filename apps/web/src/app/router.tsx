import { createBrowserRouter, Navigate } from "react-router-dom";
import ProjectsPage from "../pages/ProjectsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/projects" replace />,
  },
  {
    path: "/projects",
    element: <ProjectsPage />,
  },
]);
