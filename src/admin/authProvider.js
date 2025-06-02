// QER/src/admin/authProvider.js
const API_BASE_URL = 'http://localhost:3001/api'; // URL de tu backend

const authProvider = {
    login: async ({ username, password }) => {
        const request = new Request(`${API_BASE_URL}/auth/admin/login`, {
            method: 'POST',
            body: JSON.stringify({ email: username, password }), // 'username' de React-Admin es 'email' para tu backend
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
        try {
            const response = await fetch(request);
            if (response.status < 200 || response.status >= 300) {
                const error = await response.json();
                throw new Error(error.message || 'Error de inicio de sesión');
            }
            const auth = await response.json();
            if (auth.token && auth.adminUser) {
                localStorage.setItem('adminToken', auth.token);
                // Guardamos info del usuario, incluyendo fullName (puede ser el email)
                localStorage.setItem('adminUser', JSON.stringify({ 
                    id: auth.adminUser.id, 
                    email: auth.adminUser.email, 
                    fullName: auth.adminUser.email // React-Admin usa fullName
                }));
                return Promise.resolve();
            }
            return Promise.reject(new Error('No se recibió token o información de usuario del servidor.'));
        } catch (error) {
            throw new Error(error.message || 'Error de red o del servidor al intentar iniciar sesión.');
        }
    },
    logout: () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        // Al hacer logout, React-Admin te redirigirá a su página de login si intentas acceder a una ruta protegida.
        return Promise.resolve(); 
    },
    checkAuth: () => {
        // Si no hay token, simplemente rechaza. React-Admin mostrará su página de login por defecto.
        return localStorage.getItem('adminToken') ? Promise.resolve() : Promise.reject();
    },
    checkError: (error) => {
        const status = error.status || (error.response && error.response.status);
        if (status === 401 || status === 403) {
            localStorage.removeItem('adminToken');
            localStorage.removeItem('adminUser');
            // Devuelve un rechazo para que React-Admin redirija al login.
            return Promise.reject({ message: false }); // message:false evita una notificación de error por defecto
        }
        return Promise.resolve();
    },
    getIdentity: () => {
        try {
            const adminUserString = localStorage.getItem('adminUser');
            if (!adminUserString) {
                return Promise.reject(new Error('No se encontró información del usuario.'));
            }
            const { id, email, fullName } = JSON.parse(adminUserString);
            return Promise.resolve({ id, fullName: fullName || email, avatar: undefined });
        } catch (error) {
            return Promise.reject(new Error('Error al obtener la identidad del usuario.'));
        }
    },
    getPermissions: () => Promise.resolve(''), // Dejar vacío si no usas un sistema de permisos/roles complejo
};

export default authProvider;