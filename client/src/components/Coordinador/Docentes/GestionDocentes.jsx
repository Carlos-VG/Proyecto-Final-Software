import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Login/login'; // Importar useAuth
import ModalWindow from '../ModalWindow/ModalWindow';
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2'; // Importar SweetAlert
import '../index/CoordinadorView.css';
import '../Docentes/docente.css'

const GestionDocentes = () => {
    const { token, logout } = useAuth(); // Inicializar useAuth
    const [docentes, setDocentes] = useState([]);
    const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
    const [selectionModel, setSelectionModel] = useState([]); // Añadir estado para selectionModel
    const [esModalAbierto, setEsModalAbierto] = useState(false);
    const [esModalConsultaAbierto, setEsModalConsultaAbierto] = useState(false);
    const [nuevoDocente, setNuevoDocente] = useState({
        id: 0,
        docente_Nombres: '',
        docente_Apellidos: '',
        docente_tipoIdentificacion: 'CC',
        docente_identificacion: '',
        Docente_tipo: '',
        Docente_tipoContrato: '',
        Docente_Area: '',
        Docente_estado: 1,
        usuario: '',
        password: ''
    });

    const obtenerDocentes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/docentes', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setDocentes(response.data.body); // Actualizar el estado con los datos de la respuesta
            console.log('Docente data:', response.data.body);
        } catch (error) {
            console.error('Error al obtener docentes:', error);
        }
    };

    useEffect(() => {
        obtenerDocentes();
    }, [token]);

    const manejarSeleccionDocente = (newSelection) => {
        if (newSelection.length > 0) {
            const selectedID = newSelection[0];
            const selectedDocente = docentes.find((docente) => docente.docente_id === selectedID);
            setDocenteSeleccionado(selectedDocente);
            setSelectionModel(newSelection);
        } else {
            setDocenteSeleccionado(null);
            setSelectionModel([]);
        }
    };

    const manejarConsultarDocente = () => {
        if (docenteSeleccionado) {
            console.log('Consultando docente:', docenteSeleccionado);
            Swal.fire({
                title: 'Detalle del Docente',
                html: `
                    <p><strong>ID:</strong> ${docenteSeleccionado.docente_id}</p>
                    <p><strong>Nombres:</strong> ${docenteSeleccionado.docente_Nombres}</p>
                    <p><strong>Apellidos:</strong> ${docenteSeleccionado.docente_Apellidos}</p>
                    <p><strong>Identificación:</strong> ${docenteSeleccionado.docente_identificacion}</p>
                    <p><strong>Tipo de Contrato:</strong> ${docenteSeleccionado.Docente_tipoContrato}</p>
                    <p><strong>Estado:</strong> ${docenteSeleccionado.Docente_estado === 1 ? 'ACTIVO' : 'INACTIVO'}</p>
                `,
                icon: 'info',
                confirmButtonText: 'Cerrar'
            });
        }
    };

    const manejarEditarDocente = () => {
        if (docenteSeleccionado) {
            setEsModalConsultaAbierto(true);
        }
    };

    const abrirModal = () => {
        setEsModalAbierto(true);
    };

    const cerrarModal = () => {
        setEsModalAbierto(false);
    };

    const cerrarModalConsulta = () => {
        setEsModalConsultaAbierto(false);
    };

    const manejarCambioEntrada = (e) => {
        const { name, value } = e.target;
        setNuevoDocente({
            ...nuevoDocente,
            [name]: value
        });
    };

    const manejarCambioEstado = () => {
        setDocenteSeleccionado((prevState) => ({
            ...prevState,
            Docente_estado: prevState.Docente_estado === 1 ? 0 : 1
        }));
    };

    const manejarGuardarDocente = async () => {
        try {
            console.log('Docente guardado:', nuevoDocente);
            await axios.post('http://localhost:4000/api/docentes', nuevoDocente, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            obtenerDocentes();
            cerrarModal();
        } catch (error) {
            console.error('Error al guardar docente:', error);
        }
    };

    const manejarGuardarCambiosDocente = async () => {
        const docenteActualizado = {
            docente_Nombres: docenteSeleccionado.docente_Nombres,
            docente_Apellidos: docenteSeleccionado.docente_Apellidos,
            docente_tipoIdentificacion: docenteSeleccionado.docente_tipoIdentificacion,
            docente_identificacion: docenteSeleccionado.docente_identificacion,
            Docente_tipo: docenteSeleccionado.Docente_tipo,
            Docente_tipoContrato: docenteSeleccionado.Docente_tipoContrato,
            Docente_Area: docenteSeleccionado.Docente_Area,
        };

        try {
            console.log('Docente actualizado:', docenteActualizado);
            await axios.put(`http://localhost:4000/api/docentes/actualizar/${docenteSeleccionado.docente_id}`, docenteActualizado, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (docenteSeleccionado.Docente_estado !== docentes.find((docente) => docente.docente_id === docenteSeleccionado.docente_id).Docente_estado) {
                await axios.put(`http://localhost:4000/api/docentes/cambiarEstado/${docenteSeleccionado.docente_id}`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            obtenerDocentes();
            cerrarModalConsulta();
        } catch (error) {
            console.error('Error al actualizar docente:', error);
        }
    };

    const columns = [
        { field: 'docente_id', headerName: 'ID', width: 70 },
        { field: 'docente_Nombres', headerName: 'Nombres', width: 130 },
        { field: 'docente_Apellidos', headerName: 'Apellidos', width: 130 },
        { field: 'docente_identificacion', headerName: 'Identificación', width: 130 },
        { field: 'Docente_tipoContrato', headerName: 'Tipo de Contrato', width: 130 },
        {
            field: 'Docente_estado',
            headerName: 'Estado',
            width: 90,
            renderCell: (params) => (
                params.value === 1 ? 'ACTIVO' : 'INACTIVO'
            )
        }
    ];

    const rows = docentes.map((docente) => ({
        ...docente,
        id: docente.docente_id,
        docente_identificacion: Number(docente.docente_identificacion)
    }));

    return (
        <div className="content">
            <h2 className="heading">Gestionar docentes</h2>
            <button className="button pulse btn-primary" onClick={abrirModal}>
                Crear Docente
            </button>
            <h3 className="heading">Docentes existentes</h3>
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
                    onRowSelectionModelChange={(newSelection) => manejarSeleccionDocente(newSelection)}
                    selectionModel={selectionModel}
                />
            </div>
            <button className="button pulse btn-primary" onClick={manejarConsultarDocente}>
                Consultar Docente
            </button>
            <button className="button pulse btn-primary" onClick={manejarEditarDocente}>
                Editar Docente
            </button>

            <ModalWindow isOpen={esModalAbierto} onClose={cerrarModal}>
                <h2>Crear Docente</h2>
                <div className="modal-content">
                    <div className="modal-row">
                        <label>Nombres:</label>
                        <input
                            type="text"
                            name="docente_Nombres"
                            value={nuevoDocente.docente_Nombres}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Apellidos:</label>
                        <input
                            type="text"
                            name="docente_Apellidos"
                            value={nuevoDocente.docente_Apellidos}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Tipo de Identificación:</label>
                        <select
                            name="docente_tipoIdentificacion"
                            value={nuevoDocente.docente_tipoIdentificacion}
                            onChange={manejarCambioEntrada}
                        >
                            <option value="CC">CC</option>
                            <option value="CE">CE</option>
                        </select>
                    </div>
                    <div className="modal-row">
                        <label>Número de Identificación:</label>
                        <input
                            type="text"
                            name="docente_identificacion"
                            value={nuevoDocente.docente_identificacion}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Tipo de Docente:</label>
                        <input
                            type="text"
                            name="Docente_tipo"
                            value={nuevoDocente.Docente_tipo}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Tipo de Contrato:</label>
                        <input
                            type="text"
                            name="Docente_tipoContrato"
                            value={nuevoDocente.Docente_tipoContrato}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Área de Especialización:</label>
                        <input
                            type="text"
                            name="Docente_Area"
                            value={nuevoDocente.Docente_Area}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Usuario:</label>
                        <input
                            type="text"
                            name="usuario"
                            value={nuevoDocente.usuario}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            name="password"
                            value={nuevoDocente.password}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                </div>
                <div className="modal-buttons">
                    <button onClick={cerrarModal} className="button pulse btn-primary">
                        Salir
                    </button>
                    <button onClick={manejarGuardarDocente} className="button pulse btn-primary">
                        Guardar Cambios
                    </button>
                </div>
            </ModalWindow>

            <ModalWindow isOpen={esModalConsultaAbierto} onClose={cerrarModalConsulta}>
                <h2>Información del Docente</h2>
                {docenteSeleccionado && (
                    <div className="modal-content">
                        <div className="modal-row">
                            <label>Nombres:</label>
                            <input
                                type="text"
                                name="docente_Nombres"
                                value={docenteSeleccionado.docente_Nombres}
                                onChange={(e) =>
                                    setDocenteSeleccionado({ ...docenteSeleccionado, docente_Nombres: e.target.value })
                                }
                            />
                        </div>
                        <div className="modal-row">
                            <label>Apellidos:</label>
                            <input
                                type="text"
                                name="docente_Apellidos"
                                value={docenteSeleccionado.docente_Apellidos}
                                onChange={(e) =>
                                    setDocenteSeleccionado({ ...docenteSeleccionado, docente_Apellidos: e.target.value })
                                }
                            />
                        </div>
                        <div className="modal-row">
                            <label>Tipo de Identificación:</label>
                            <select
                                name="docente_tipoIdentificacion"
                                value={docenteSeleccionado.docente_tipoIdentificacion}
                                onChange={(e) =>
                                    setDocenteSeleccionado({ ...docenteSeleccionado, docente_tipoIdentificacion: e.target.value })
                                }
                            >
                                <option value="CC">CC</option>
                                <option value="CE">CE</option>
                            </select>
                        </div>
                        <div className="modal-row">
                            <label>Número de Identificación:</label>
                            <input
                                type="text"
                                name="docente_identificacion"
                                value={docenteSeleccionado.docente_identificacion}
                                onChange={(e) =>
                                    setDocenteSeleccionado({ ...docenteSeleccionado, docente_identificacion: e.target.value })
                                }
                            />
                        </div>
                        <div className="modal-row">
                            <label>Tipo de Docente:</label>
                            <select
                                name="Docente_tipo"
                                value={docenteSeleccionado.Docente_tipo}
                                onChange={(e) =>
                                    setDocenteSeleccionado({ ...docenteSeleccionado, Docente_tipo: e.target.value })
                                }
                            >
                                <option value="Tecnico">Tecnico</option>
                                <option value="Profesional">Profesional</option>
                            </select>
                        </div>
                        <div className="modal-row">
                            <label>Tipo de Contrato:</label>
                            <select
                                name="Docente_tipoContrato"
                                value={docenteSeleccionado.Docente_tipoContrato}
                                onChange={(e) =>
                                    setDocenteSeleccionado({ ...docenteSeleccionado, Docente_tipoContrato: e.target.value })
                                }
                            >
                                <option value="PT">PT</option>
                                <option value="CNT">CNT</option>
                            </select>
                        </div>
                        <div className="modal-row">
                            <label>Área de Especialización:</label>
                            <input
                                type="text"
                                name="Docente_Area"
                                value={docenteSeleccionado.Docente_Area}
                                onChange={(e) =>
                                    setDocenteSeleccionado({ ...docenteSeleccionado, Docente_Area: e.target.value })
                                }
                            />
                        </div>
                        <div className="modal-row centered-button">
                            <label>Estado:</label>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={docenteSeleccionado.Docente_estado === 1}
                                    onChange={manejarCambioEstado}
                                />
                                <div className="toggle-switch-background">
                                    <div className="toggle-switch-handle"></div>
                                </div>
                            </label>
                        </div>
                    </div>
                )}
                <div className="modal-buttons-2x2">
                    <button onClick={cerrarModalConsulta} className="button pulse btn-secondary">Salir</button>
                    <button onClick={manejarGuardarCambiosDocente} className="button pulse btn-primary">Guardar Cambios</button>
                </div>
            </ModalWindow>
        </div>
    );
};

export default GestionDocentes;
