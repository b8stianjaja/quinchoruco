// QER/src/admin/AdminPanel.jsx
import React from 'react';
import { Admin, Resource } from 'react-admin'; // Ya NO importamos LoginPage ni Layout aquí
import authProvider from './authProvider';
import dataProvider from './dataProvider'; // Asegúrate que este archivo exista y esté configurado
import { BookingRequestList, BookingRequestEdit } from './resources/BookingRequests';
// Si tienes iconos: import BookIcon from '@mui/icons-material/Book';
// Si tienes un layout personalizado: import MyAdminLayout from './MyAdminLayout';

const AdminPanel = () => {
    return (
        <Admin 
            dataProvider={dataProvider} 
            authProvider={authProvider}
            // No se necesita la prop loginPage si queremos usar la default de React-Admin
            // activada por el authProvider.
            // layout={MyAdminLayout} // Si tienes un layout personalizado
            // requireAuth // Esta prop es para versiones antiguas.
        >
            <Resource 
                name="booking-requests" // Esta es la parte de la URL de tu API: /api/booking-requests
                options={{ label: 'Solicitudes de Reserva' }} 
                list={BookingRequestList}
                edit={BookingRequestEdit}
                // icon={BookIcon} // Opcional
            />
            {/* Puedes añadir más <Resource> aquí para otros datos que quieras gestionar */}
        </Admin>
    );
};

export default AdminPanel;