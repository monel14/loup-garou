import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './components/Login';
import Lobby from './components/Lobby';
import Game from './components/Game';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<PrivateRoute><Lobby /></PrivateRoute>} />
            <Route path="/game/:gameId" element={<PrivateRoute><Game /></PrivateRoute>} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App;