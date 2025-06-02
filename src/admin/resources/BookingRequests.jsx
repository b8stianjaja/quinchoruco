// QER/src/admin/resources/BookingRequests.jsx
import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  DateField,
  EmailField,
  EditButton,
  Edit,
  SimpleForm,
  TextInput,
  SelectInput,
  DateInput,
  ReferenceInput,
  AutocompleteInput,
  NumberInput,
  BooleanField, // Para mostrar el estado como booleano si es necesario
  FunctionField // Para renderizar campos de forma personalizada
} from 'react-admin';

// Para el <SelectInput> del estado
const statusChoices = [
    { id: 'pending', name: 'Pendiente' },
    { id: 'confirmed', name: 'Confirmada' },
    { id: 'rejected', name: 'Rechazada' },
];

export const BookingRequestList = (props) => (
  <List {...props} title="Solicitudes de Reserva" sort={{ field: 'createdAt', order: 'DESC' }}>
    <Datagrid rowClick="edit"> {/* O "show" si creas un componente Show */}
      <DateField source="bookingDate" label="Fecha Reserva" locales="es-CL" />
      <TextField source="slotType" label="Franja" />
      <TextField source="userName" label="Nombre Cliente" />
      <EmailField source="userEmail" label="Email Cliente" />
      <TextField source="status" label="Estado" />
      <DateField source="createdAt" label="Fecha Solicitud" locales="es-CL" showTime />
      <EditButton />
    </Datagrid>
  </List>
);

export const BookingRequestEdit = (props) => (
  <Edit {...props} title="Editar Solicitud de Reserva">
    <SimpleForm>
      <TextInput source="id" disabled />
      <DateInput source="bookingDate" label="Fecha Reserva" disabled />
      <TextInput source="slotType" label="Franja" disabled />
      <TextInput source="userName" label="Nombre Cliente" />
      <EmailInput source="userEmail" label="Email Cliente" />
      <TextInput source="userPhone" label="Teléfono" />
      <NumberInput source="guestCount" label="Nº Invitados" />
      <TextInput source="notes" label="Notas" multiline fullWidth />
      <SelectInput source="status" label="Estado" choices={statusChoices} />
      <DateField source="createdAt" label="Fecha Solicitud" showTime disabled />
      <DateField source="updatedAt" label="Última Actualización" showTime disabled />
    </SimpleForm>
  </Edit>
);