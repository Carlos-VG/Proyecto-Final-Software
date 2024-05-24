import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Login/login'; // Importar useAuth
import ModalWindow from '../ModalWindow/ModalWindow';
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2'; // Importar SweetAlert
import '../index/CoordinadorView.css';
import '../Docentes/docente.css'

const GestionProgramas = () => {
    const { token, logout } = useAuth(); // Inicializar useAuth
    const [programas, setProgramas] = useState([]);
    const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
    const [selectionModel, setSelectionModel] = useState([]); // Añadir estado para selectionModel
    const [esModalConsultaAbierto, setEsModalConsultaAbierto] = useState(false);

    const obtenerProgramas = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/Programas', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setProgramas(response.data); // Actualizar el estado con los datos de la respuesta
            console.log('Programas data:', response.data);
        } catch (error) {
            console.error('Error al obtener programas:', error);
        }
    };

    useEffect(() => {
        obtenerProgramas();
    }, [token]);

    const manejarSeleccionPrograma = (newSelection) => {
        if (newSelection.length > 0) {
            const selectedID = newSelection[0];
            const selectedPrograma = programas.find((programa) => programa.id === selectedID);
            setProgramaSeleccionado(selectedPrograma);
            setSelectionModel(newSelection);
        } else {
            setProgramaSeleccionado(null);
            setSelectionModel([]);
        }
    };

    const manejarConsultarPrograma = () => {
        if (programaSeleccionado) {
            console.log('Consultando programa:', programaSeleccionado);
            Swal.fire({
                title: 'Detalle del Programa',
                html: `
                    <p><strong>ID:</strong> ${programaSeleccionado.id}</p>
                    <p><strong>Nombre:</strong> ${programaSeleccionado.programa_nombre}</p>
                    <p><strong>Estado:</strong> ${programaSeleccionado.programa_estado === 1 ? 'ACTIVO' : 'INACTIVO'}</p>
                    <p><strong>Competencias:</strong> ${programaSeleccionado.competencias.map(comp => `<br/>- ${comp.competencia_nombre}`).join('')}</p>
                `,
                icon: 'info',
                confirmButtonText: 'Cerrar'
            });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'programa_nombre', headerName: 'Nombre', width: 200 },
        { field: 'programa_estado', headerName: 'Estado', width: 100, renderCell: (params) => (
            params.value === 1 ? 'ACTIVO' : 'INACTIVO'
        )}
    ];

    const rows = programas.map((programa) => ({
        ...programa,
        id: programa.id
    }));

    return (
        <div className="content">
            <h2 className="heading">Gestionar Programas</h2>
            <h3 className="heading">Programas existentes</h3>
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
                    onRowSelectionModelChange={(newSelection) => manejarSeleccionPrograma(newSelection)}
                    selectionModel={selectionModel}
                />
            </div>
            <button className="button pulse btn-primary" onClick={manejarConsultarPrograma}>
                Consultar Programa
            </button>
        </div>
    );
};

export default GestionProgramas;
