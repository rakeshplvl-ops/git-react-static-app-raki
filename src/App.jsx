import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "./contexts/ToastContext";
import "./App.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import LoginPage from "./pages/LoginPage";
import TasksDisplayPage from "./pages/TasksDisplayPage";
import TaskDetail from "./pages/TaskDetail";
import ProtectedRoute from "./components/user-login-layer/ProtectedRoute";
import HomePage from "./pages/HomePage";
import PublicLayout from "./components/Layouts/PublicLayout";
import AppLayout from "./components/Layouts/AppLayout";
import ProfilePage from "./pages/ProfilePage";
import EditProfilePage from "./pages/EditProfilePage";
import CreateTaskPage from "./pages/CreateTaskPage";
import AboutPage from "./pages/AboutPage";
import { SearchProvider } from "./contexts/SearchContext";

function App() {
  const { showToast } = useToast();
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setIsOffline(true);
      showToast("Server is unreachable. Please check your connection.", "error");
    };

    window.addEventListener("server-offline", handleOffline);
    return () => window.removeEventListener("server-offline", handleOffline);
  }, [showToast]);

  return (
    <SearchProvider>
      <div className="site-container">
        {isOffline && (
          <div className="offline-banner">
            ⚠️ Server unreachable. Showing cached data.
            <button onClick={() => window.location.reload()} className="retry-btn">Retry</button>
          </div>
        )}
        <Header />
        <main className="main-container">
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/login" element={<LoginPage className="LoginPage-Site-Container" />} />
            <Route path="/" element={<HomePage />} />
          </Route>

          <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
            <Route path="/tasks" element={<TasksDisplayPage />} />
            <Route path="/tasks/:filter" element={<TasksDisplayPage />} />
            <Route path="/tasks/detail/:id" element={<TaskDetail />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
            <Route path="/create-task" element={<CreateTaskPage />} />
          </Route>
          
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </main>
    <Footer />
  </div>
    </SearchProvider>
  );
}

export default App;
