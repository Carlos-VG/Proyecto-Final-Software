import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Login/login'; // Importar useAuth
import ModalWindow from '../ModalWindow/ModalWindow';
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2'; 
import '../index/CoordinadorView.css';

const GestionAmbientes = () => {
    const { token, logout } = useAuth(); // Inicializar useAuth
    const [ambientes, setAmbientes] = useState([]);
    const [ambienteSeleccionado, setAmbienteSeleccionado] = useState(null);
    const [selectionModel, setSelectionModel] = useState([]); // Añadir estado para selectionModel
    const [esModalAbierto, setEsModalAbierto] = useState(false);
    const [nuevoAmbiente, setNuevoAmbiente] = useState({
        ambiente_nombre: '',
        ambiente_tipo: '',
        ambiente_capacidad: '',
        ambiente_ubicacion: '',
        ambiente_estado: 1
    });
    const [ambientePiso, setAmbientePiso] = useState(''); // Estado para el piso

    const obtenerAmbientes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/ambientes', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setAmbientes(response.data.body); // Actualizar el estado con los datos de la respuesta
            console.log('Ambiente data:', response.data.body);
        } catch (error) {
            console.error('Error al obtener ambientes:', error);
        }
    };

    useEffect(() => {
        obtenerAmbientes();
    }, [token]);

    const manejarSeleccionAmbiente = (newSelection) => {
        if (newSelection.length > 0) {
            const selectedID = newSelection[0];
            const selectedAmbiente = ambientes.find((ambiente) => ambiente.ambiente_id === selectedID);
            setAmbienteSeleccionado(selectedAmbiente);
            setSelectionModel(newSelection);
        } else {
            setAmbienteSeleccionado(null);
            setSelectionModel([]);
        }
    };

    const manejarConsultarAmbiente = () => {
        if (ambienteSeleccionado) {
            console.log('Consultando ambiente:', ambienteSeleccionado);
            Swal.fire({
                title: 'Detalle del Ambiente',
                html: `
                    <p><strong>ID:</strong> ${ambienteSeleccionado.ambiente_id}</p>
                    <p><strong>Nombre:</strong> ${ambienteSeleccionado.ambiente_nombre}</p>
                    <p><strong>Tipo:</strong> ${ambienteSeleccionado.ambiente_tipo}</p>
                    <p><strong>Capacidad:</strong> ${ambienteSeleccionado.ambiente_capacidad}</p>
                    <p><strong>Ubicación:</strong> ${ambienteSeleccionado.ambiente_ubicacion}</p>
                    <p><strong>Estado:</strong> ${ambienteSeleccionado.ambiente_estado === 1 ? 'ACTIVO' : 'INACTIVO'}</p>
                `,
                icon: 'info',
                confirmButtonText: 'Cerrar'
            });
        }
    };

    const abrirModal = () => {
        setEsModalAbierto(true);
    };

    const cerrarModal = () => {
        setEsModalAbierto(false);
    };

    const manejarCambioEntrada = (e) => {
        const { name, value } = e.target;
        setNuevoAmbiente({
            ...nuevoAmbiente,
            [name]: value
        });
    };

    const manejarCambioPiso = (e) => {
        setAmbientePiso(e.target.value);
    };

    const manejarGuardarAmbiente = async () => {
        if (parseInt(ambientePiso, 10) <= 0) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'El piso debe ser mayor a 0!',
            });
            return;
        }
        const ambienteConPiso = {
            ...nuevoAmbiente,
            ambiente_ubicacion: `${nuevoAmbiente.ambiente_ubicacion} Piso ${ambientePiso}`
        };

        try {
            await axios.post('http://localhost:4000/api/ambientes', ambienteConPiso, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            obtenerAmbientes();
            cerrarModal();
        } catch (error) {
            console.error('Error al guardar ambiente:', error);
        }
    };

    const columns = [
        { field: 'ambiente_id', headerName: 'ID', width: 70 },
        { field: 'ambiente_nombre', headerName: 'Nombre', width: 200 },
        { field: 'ambiente_tipo', headerName: 'Tipo', width: 150 },
        { field: 'ambiente_capacidad', headerName: 'Capacidad', width: 150 },
        { field: 'ambiente_estado', headerName: 'Estado', width: 100, renderCell: (params) => (
            params.value === 1 ? 'ACTIVO' : 'INACTIVO'
        )}
    ];

    const rows = ambientes.map((ambiente) => ({
        ...ambiente,
        id: ambiente.ambiente_id
    }));

    return (
        <div className="content">
            <h2 className="heading">Gestionar ambientes</h2>
            <button className="button pulse btn-primary" onClick={abrirModal}>
                Crear Ambiente
            </button>
            <h3 className="heading">Ambientes existentes</h3>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                          paginationModel: { page: 0, pageSize: 5 },
                        },
                      }}
                    checkboxSelection={false}
                    onRowSelectionModelChange={(newSelection) => manejarSeleccionAmbiente(newSelection)}
                    selectionModel={selectionModel}
                />
            </div>
            <button className="button pulse btn-primary" onClick={manejarConsultarAmbiente}>
                Consultar Ambiente
            </button>

            <ModalWindow isOpen={esModalAbierto} onClose={cerrarModal}>
                <h2>Crear Ambiente</h2>
                <div className="modal-content">
                    <div className="modal-row">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="ambiente_nombre"
                            value={nuevoAmbiente.ambiente_nombre}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Tipo:</label>
                        <input
                            type="text"
                            name="ambiente_tipo"
                            value={nuevoAmbiente.ambiente_tipo}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Capacidad:</label>
                        <input
                            type="number"
                            name="ambiente_capacidad"
                            value={nuevoAmbiente.ambiente_capacidad}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Ubicación:</label>
                        <input
                            type="text"
                            name="ambiente_ubicacion"
                            value={nuevoAmbiente.ambiente_ubicacion}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Piso:</label>
                        <input
                            type="number"
                            name="ambiente_piso"
                            value={ambientePiso}
                            onChange={manejarCambioPiso}
                        />
                    </div>
                </div>
                <div className="modal-buttons">
                    <button onClick={cerrarModal} className="button pulse btn-primary">
                        Salir
                    </button>
                    <button onClick={manejarGuardarAmbiente} className="button pulse btn-primary">
                        Guardar Cambios
                    </button>
                </div>
            </ModalWindow>
        </div>
    );
};

export default GestionAmbientes;
