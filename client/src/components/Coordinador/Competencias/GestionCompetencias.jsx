import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Login/login'; // Importar useAuth
import ModalWindow from '../ModalWindow/ModalWindow';
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2'; // Importar SweetAlert
import '../index/CoordinadorView.css';
import '../Docentes/docente.css'

const GestionCompetencias = () => {
    const { token, logout } = useAuth(); // Inicializar useAuth
    const [competencias, setCompetencias] = useState([]);
    const [competenciaSeleccionada, setCompetenciaSeleccionada] = useState(null);
    const [selectionModel, setSelectionModel] = useState([]); // Añadir estado para selectionModel
    const [esModalConsultaAbierto, setEsModalConsultaAbierto] = useState(false);

    const obtenerCompetencias = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/competencias', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCompetencias(response.data); // Actualizar el estado con los datos de la respuesta
            console.log('Competencias data:', response.data);
        } catch (error) {
            console.error('Error al obtener competencias:', error);
        }
    };

    useEffect(() => {
        obtenerCompetencias();
    }, [token]);

    const manejarSeleccionCompetencia = (newSelection) => {
        if (newSelection.length > 0) {
            const selectedID = newSelection[0];
            const selectedCompetencia = competencias.find((competencia) => competencia.id === selectedID);
            setCompetenciaSeleccionada(selectedCompetencia);
            setSelectionModel(newSelection);
        } else {
            setCompetenciaSeleccionada(null);
            setSelectionModel([]);
        }
    };

    const manejarConsultarCompetencia = () => {
        if (competenciaSeleccionada) {
            console.log('Consultando competencia:', competenciaSeleccionada);
            Swal.fire({
                title: 'Detalle de la Competencia',
                html: `
                    <p><strong>ID:</strong> ${competenciaSeleccionada.id}</p>
                    <p><strong>Nombre:</strong> ${competenciaSeleccionada.competencia_nombre}</p>
                    <p><strong>Tipo:</strong> ${competenciaSeleccionada.competencia_tipo}</p>
                    <p><strong>Estado:</strong> ${competenciaSeleccionada.competencia_estado === 1 ? 'ACTIVO' : 'INACTIVO'}</p>
                `,
                icon: 'info',
                confirmButtonText: 'Cerrar'
            });
        }
    };

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'competencia_nombre', headerName: 'Nombre', width: 200 },
        { field: 'competencia_tipo', headerName: 'Tipo', width: 150 },
        { field: 'competencia_estado', headerName: 'Estado', width: 100, renderCell: (params) => (
            params.value === 1 ? 'ACTIVO' : 'INACTIVO'
        )}
    ];

    const rows = competencias.map((competencia) => ({
        ...competencia,
        id: competencia.id
    }));

    return (
        <div className="content">
            <h2 className="heading">Gestionar Competencias</h2>
            <h3 className="heading">Competencias existentes</h3>
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
                    onRowSelectionModelChange={(newSelection) => manejarSeleccionCompetencia(newSelection)}
                    selectionModel={selectionModel}
                />
            </div>
            <button className="button pulse btn-primary" onClick={manejarConsultarCompetencia}>
                Consultar Competencia
            </button>
        </div>
    );
};

export default GestionCompetencias;
