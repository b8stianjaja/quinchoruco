// QER/src/admin/AdminLoginPage.jsx
import React, { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';
import { useNavigate } from 'react-router-dom';

const AdminLoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const login = useLogin();
    const notify = useNotify();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        login({ username: email, password }) // authProvider espera 'username'
            .then(() => {
                navigate('/admin'); // Redirige al dashboard del admin después del login
            })
            .catch((error) => {
                notify(error.message || 'Error de inicio de sesión. Verifique sus credenciales.', { type: 'error' });
            });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h2>Login de Administrador</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', width: '300px', gap: '1rem' }}>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '1rem' }}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    style={{ padding: '10px', fontSize: '1rem' }}
                />
                <button type="submit" style={{ padding: '10px', fontSize: '1rem', cursor: 'pointer' }}>Iniciar Sesión</button>
            </form>
            <Notification /> {/* Para mostrar notificaciones de error de react-admin */}
        </div>
    );
};

export default AdminLoginPage;