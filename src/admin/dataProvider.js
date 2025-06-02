// QER/src/admin/dataProvider.js
import simpleRestProvider from 'ra-data-simple-rest';

const API_BASE_URL = 'http://localhost:3001/api'; // La URL de tu backend

// El dataProvider de simpleRestProvider espera que tu API tenga rutas como /recurso/:id
// y que el ID se llame 'id'. Ya ajustamos el backend para devolver 'id'.
const dataProvider = simpleRestProvider(API_BASE_URL, (httpClient,
    options = {
        headers: new Headers({ Accept: 'application/json' }),
    }
) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
        if (!options.headers) {
            options.headers = new Headers({ Accept: 'application/json' });
        }
        options.headers.set('Authorization', `Bearer ${token}`);
    }
    return httpClient(options.url, options);
});


// Pequeña adaptación para que funcione mejor con nuestro backend y renombrar _id a id
const myDataProvider = {
    ...dataProvider,
    getList: (resource, params) => {
        // ra-data-simple-rest maneja la paginación y ordenación
        // y espera 'X-Total-Count' en los headers, que ya configuramos en el backend
        return dataProvider.getList(resource, params).then(({ data, total }) => ({
            data: data, // Ya mapeamos _id a id en el backend para GET /api/booking-requests
            total,
        }));
    },
    getOne: (resource, params) => 
        dataProvider.getOne(resource, params).then(response => ({
            data: response.data, // Ya mapeamos _id a id
        })),
    update: (resource, params) =>
        dataProvider.update(resource, params).then(response => ({
            data: response.data, // Ya mapeamos _id a id
        })),
    create: (resource, params) => // Aunque el público crea, el admin podría necesitarlo
        dataProvider.create(resource, params).then(response => ({
            data: response.data, // Ya mapeamos _id a id
        })),
    // delete y deleteMany pueden necesitar adaptaciones si el backend no devuelve el record eliminado como data.
    // El dataProvider que te di para el backend SÍ devuelve el record eliminado.
};

export default myDataProvider;