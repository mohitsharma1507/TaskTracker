import { useEffect, useState } from "react";
import { getCurrentUser } from "../utils/auth";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const user = getCurrentUser();

  useEffect(() => {
    const FetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:8080/projects", {
          withCredentials: true,
        });
        if (res.data.status && Array.isArray(res.data.data)) {
          setProjects(res.data.data);
        } else {
          console.error("Projects data is not an array:", res.data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    FetchProjects();
  }, []);

  if (!user) return <p>Please login to view your dashboard.</p>;
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">Welcome, {user.name}!</h1>
      <p className="mb-4 text-gray-600">Country: {user.country}</p>
      <div className="mb-4">
        <Link
          to="/projects/new"
          className="bg-blue-600 text-primary px-4 py-2 rounded"
        >
          Create New Project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p>No projects yet. Create your first one!</p>
      ) : (
        <div className="grid gap-4">
          {projects.map((project) => (
            <Link
              key={project._id}
              to={`/projects/${project._id}/tasks`}
              className="border p-4 rounded hover:bg-gray-100 block"
            >
              <h2 className="text-xl font-semibold">{project.title}</h2>
              <p className="text-gray-600">{project.description}</p>
              <p className="text-sm text-gray-400">
                Created on: {new Date(project.createdAt).toLocaleDateString()}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
