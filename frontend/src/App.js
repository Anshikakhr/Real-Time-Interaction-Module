import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Home from './components/Home';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import Admin from './components/Admin';
import User from './components/User';
import Results from './components/Results';
import AdminSetup from './components/AdminSetup';
import AdminPollCreate from './components/AdminPollCreate';
import UserSessionJoin from './components/UserJoinPoll';


const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Header />
          <Routes>
            {/* existing routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            <Route 
              path="/admin" 
              element={
                <PrivateRoute adminOnly={true}>
                  <Admin />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/polls" 
              element={
                <PrivateRoute>
                  <User />
                </PrivateRoute>
              } 
            />
            
            <Route 
              path="/results/:pollId" 
              element={
                <PrivateRoute>
                  <Results />
                </PrivateRoute>
              } 
            />
            
            <Route path="/admin-setup" element={<AdminSetup />} />

            {/* New routes for polling system */}
            <Route 
              path="/admin/poll-create" 
              element={
                <PrivateRoute adminOnly={true}>
                  <AdminPollCreate />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/poll/join" 
              element={
                <PrivateRoute>
                  <UserSessionJoin />
                </PrivateRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
