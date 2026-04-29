import { Route, Routes } from "react-router-dom";
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
  return (
    <SearchProvider>
      <div className="site-container">
        <Header />
        <main className="main-container">
        <Routes>
          <Route element={<PublicLayout />}>
            <Route
              path="/Login"
              element={<LoginPage className="LoginPage-Site-Container" />}
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <HomePage />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <TasksDisplayPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:filter"
              element={
                <ProtectedRoute>
                  <TasksDisplayPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/TaskDetail/:id"
              element={
                <ProtectedRoute>
                  <TaskDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <ProtectedRoute>
                  <EditProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-task"
              element={
                <ProtectedRoute>
                  <CreateTaskPage />
                </ProtectedRoute>
              }
            />
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
