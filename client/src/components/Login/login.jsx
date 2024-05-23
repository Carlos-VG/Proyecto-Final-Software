import React, { useState, createContext, useContext } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './login.css';
import CoordinadorView from '../Coordinador/CoordinadorView';
import DocenteView from '../Docentes/DocenteView';

// Crear el contexto de autenticación
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [token, setToken] = useState('');
    const [rol, setRol] = useState('');

    const login = (newToken, newRol) => {
        setToken(newToken);
        setRol(newRol);
    };

    const logout = () => {
        setToken('');
        setRol('');
    };

    return (
        <AuthContext.Provider value={{ token, rol, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

const useAuth = () => {
    return useContext(AuthContext);
};

// Crear el componente de ruta protegida
const ProtectedRoute = ({ children, roles }) => {
    const { token, rol } = useAuth();

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(rol)) {
        return <Navigate to="/login" />;
    }

    return children;
};

const App = () => {
    const [usuario, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/api/auth/login', {
                usuario,
                password
            });
            if (response.status === 200) {
                const token = response.data.body;
                const rolResponse = await axios.get('http://localhost:4000/api/auth/rol', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (rolResponse.status === 200) {
                    const rol = rolResponse.data.body;
                    login(token, rol);
                    if (rol === 'coordinador') {
                        navigate('/coordinador');
                    } else if (rol === 'docente') {
                        navigate('/docente');
                    }
                } else {
                    throw new Error(rolResponse.data.message || 'Error al verificar el rol');
                }
            } else {
                throw new Error(response.data.message || 'Error al iniciar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <Routes>
                    <Route path="/login" element={
                        <div className="d-flex justify-content-center align-items-center vh-100 login-background">
                            <form onSubmit={handleSubmit} className="login-form p-5 rounded">
                                <h2 className="text-center mb-4">Iniciar Sesión</h2>
                                <div className="form-group mb-3">
                                    <label htmlFor="username">Usuario:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        value={usuario}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="password">Contraseña:</label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary w-100">Iniciar Sesión</button>
                            </form>
                        </div>
                    } />
                    <Route path="/coordinador" element={
                        <ProtectedRoute roles={['coordinador']}>
                            <CoordinadorView />
                        </ProtectedRoute>
                    } />
                    <Route path="/docente" element={
                        <ProtectedRoute roles={['docente']}>
                            <DocenteView />
                        </ProtectedRoute>
                    } />
                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </header>
        </div>
    );
};

const RootApp = () => (
    <AuthProvider>
        <App />
    </AuthProvider>
);

export default RootApp;
