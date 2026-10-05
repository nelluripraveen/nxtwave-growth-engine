import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { RegisterPage } from './pages/RegisterPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LeaderboardPage } from './pages/LeaderboardPage';
import { CollegePage } from './pages/CollegePage';
import { SharePage } from './pages/SharePage';
import { AmbassadorPage } from './pages/AmbassadorPage';
import { AdminPage } from './pages/AdminPage';
import { store } from './store/dataStore';

// Route guard: redirect registered users away from guest pages (like /register and /login)
function GuestGuard({ children }: { children: React.ReactNode }) {
  const current = store.getCurrentStudent();
  if (current) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

// Route guard: redirect unregistered users to /login
function AuthGuard({ children }: { children: React.ReactNode }) {
  const current = store.getCurrentStudent();
  if (!current) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

// Admin guard: only accessible via direct URL, deny normal students
function AdminGuard() {
  // For demo purposes, admin is accessible — but a real app would check credentials
  return <AdminPage />;
}

function AppLayout() {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';

  return (
    <>
      {!isAdmin && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<GuestGuard><RegisterPage /></GuestGuard>} />
        <Route path="/login" element={<GuestGuard><LoginPage /></GuestGuard>} />
        <Route path="/dashboard" element={<AuthGuard><DashboardPage /></AuthGuard>} />
        <Route path="/leaderboard" element={<AuthGuard><LeaderboardPage /></AuthGuard>} />
        <Route path="/colleges" element={<AuthGuard><CollegePage /></AuthGuard>} />
        <Route path="/share" element={<AuthGuard><SharePage /></AuthGuard>} />
        <Route path="/ambassador" element={<AmbassadorPage />} />
        <Route path="/admin" element={<AdminGuard />} />
        <Route path="*" element={
          <div style={{ padding: '120px 20px', textAlign: 'center' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Page Not Found</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>The page you're looking for doesn't exist.</p>
            <a href="/" className="btn-primary" style={{ display: 'inline-flex' }}>Go Home</a>
          </div>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}
