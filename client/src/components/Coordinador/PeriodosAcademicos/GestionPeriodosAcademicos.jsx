import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../Login/login'; // Importar useAuth
import ModalWindow from '../ModalWindow/ModalWindow';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { DataGrid } from '@mui/x-data-grid';
import Swal from 'sweetalert2'; // Importar SweetAlert
import '../index/CoordinadorView.css';

const GestionPeriodosAcademicos = () => {
    const { token, logout } = useAuth(); // Inicializar useAuth
    const [periodosAcademicos, setPeriodosAcademicos] = useState([]);
    const [programas, setProgramas] = useState([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null);
    const [selectionModel, setSelectionModel] = useState([]); // Añadir estado para selectionModel
    const [esModalAbierto, setEsModalAbierto] = useState(false);
    const [esModalConsultaAbierto, setEsModalConsultaAbierto] = useState(false);
    const [nuevoPeriodo, setNuevoPeriodo] = useState({
        periodo_nombre: '',
        periodo_fecha_inicio: null,
        periodo_fecha_fin: null,
        programas: []
    });

    useEffect(() => {
        obtenerPeriodosAcademicos();
        obtenerProgramas();
    }, [token]);

    const obtenerPeriodosAcademicos = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/periodosAcademicos', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (Array.isArray(response.data.body)) {
                setPeriodosAcademicos(response.data.body);
            } else {
                console.error('Expected array but got:', response.data.body);
            }
        } catch (error) {
            console.error('Error al obtener periodos académicos:', error);
        }
    };

    const obtenerProgramas = async () => {
        try {
            const response = await axios.get('http://localhost:4000/api/programas', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const programasActivos = response.data
                .filter(programa => programa.programa_estado === 1)
                .map(programa => ({ ...programa, id: parseInt(programa.id) }));
            setProgramas(programasActivos);
        } catch (error) {
            console.error('Error al obtener programas:', error);
        }
    };
    

    const manejarSeleccionPeriodo = (newSelection) => {
        if (newSelection.length > 0) {
            const selectedID = newSelection[0];
            const selectedPeriodo = periodosAcademicos.find((periodo) => periodo.periodo_id === selectedID);
            setPeriodoSeleccionado(selectedPeriodo);
            setSelectionModel(newSelection);
        } else {
            setPeriodoSeleccionado(null);
            setSelectionModel([]);
        }
    };

    const manejarConsultarPeriodo = () => {
        if (periodoSeleccionado) {
            console.log('Consultando período:', periodoSeleccionado);
            Swal.fire({
                title: 'Detalle del Período Académico',
                html: `
                    <p><strong>ID:</strong> ${periodoSeleccionado.periodo_id}</p>
                    <p><strong>Nombre:</strong> ${periodoSeleccionado.periodo_nombre}</p>
                    <p><strong>Fecha de Inicio:</strong> ${new Date(periodoSeleccionado.periodo_fecha_inicio).toLocaleDateString()}</p>
                    <p><strong>Fecha de Fin:</strong> ${new Date(periodoSeleccionado.periodo_fecha_fin).toLocaleDateString()}</p>
                    <p><strong>Estado:</strong> ${periodoSeleccionado.periodo_estado === 1 ? 'ACTIVO' : 'INACTIVO'}</p>
                `,
                icon: 'info',
                confirmButtonText: 'Cerrar'
            });
        }
    };

    const manejarEditarPeriodo = () => {
        if (periodoSeleccionado) {
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
        setNuevoPeriodo({
            ...nuevoPeriodo,
            [name]: value
        });
    };

    const manejarCambioProgramas = (e) => {
        const { value, checked } = e.target;
        setNuevoPeriodo(prevState => {
            const programas = checked
                ? [...prevState.programas, parseInt(value)]
                : prevState.programas.filter(id => id !== parseInt(value));
            return { ...prevState, programas };
        });
    };

    const manejarCambioProgramasSeleccionado = (e) => {
        const { value, checked } = e.target;
        setPeriodoSeleccionado(prevState => {
            const programas = checked
                ? [...prevState.programas, parseInt(value)]
                : prevState.programas.filter(id => id !== parseInt(value));
            return { ...prevState, programas };
        });
    };


    const manejarCambioEstado = () => {
        setPeriodoSeleccionado(prevState => ({
            ...prevState,
            periodo_estado: prevState.periodo_estado === 1 ? 0 : 1
        }));
    };

    const manejarGuardarPeriodo = async () => {
        const periodoAcademico = {
            periodoAcademico: {
                periodo_nombre: nuevoPeriodo.periodo_nombre,
                periodo_fecha_inicio: nuevoPeriodo.periodo_fecha_inicio.toISOString().split('T')[0],
                periodo_fecha_fin: nuevoPeriodo.periodo_fecha_fin.toISOString().split('T')[0]
            },
            programas: nuevoPeriodo.programas
        };

        try {
            console.log('Nuevo período académico:', periodoAcademico);
            await axios.post('http://localhost:4000/api/periodosAcademicos', periodoAcademico, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            obtenerPeriodosAcademicos();
            cerrarModal();
        } catch (error) {
            console.error('Error al guardar el período académico:', error);
        }
    };

    const manejarGuardarCambiosPeriodo = async () => {
        // Convertir fechas a objetos Date si son cadenas
        const fechaInicio = typeof periodoSeleccionado.periodo_fecha_inicio === 'string'
            ? new Date(periodoSeleccionado.periodo_fecha_inicio)
            : periodoSeleccionado.periodo_fecha_inicio;
        const fechaFin = typeof periodoSeleccionado.periodo_fecha_fin === 'string'
            ? new Date(periodoSeleccionado.periodo_fecha_fin)
            : periodoSeleccionado.periodo_fecha_fin;

        const periodoActualizado = {
            periodoAcademico: {
                periodo_nombre: periodoSeleccionado.periodo_nombre,
                periodo_fecha_inicio: fechaInicio.toISOString().split('T')[0],
                periodo_fecha_fin: fechaFin.toISOString().split('T')[0]
            },
            programas: periodoSeleccionado.programas
        };

        try {
            console.log('Período académico actualizado:', periodoActualizado);
            await axios.put(`http://localhost:4000/api/periodosAcademicos/${periodoSeleccionado.periodo_id}`, periodoActualizado, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (periodoSeleccionado.periodo_estado !== periodosAcademicos.find((periodo) => periodo.periodo_id === periodoSeleccionado.periodo_id).periodo_estado) {
                await axios.put(`http://localhost:4000/api/periodosAcademicos/cambiarEstado/${periodoSeleccionado.periodo_id}`, null, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
            }

            obtenerPeriodosAcademicos();
            cerrarModalConsulta();
        } catch (error) {
            console.error('Error al actualizar el período académico:', error);
        }
    };


    const columns = [
        { field: 'periodo_id', headerName: 'ID', width: 70 },
        { field: 'periodo_nombre', headerName: 'Nombre', width: 200 },
        { field: 'periodo_fecha_inicio', headerName: 'Fecha de Inicio', width: 150 },
        { field: 'periodo_fecha_fin', headerName: 'Fecha de Fin', width: 150 },
        {
            field: 'periodo_estado',
            headerName: 'Estado',
            width: 100,
            renderCell: (params) => (
                params.value === 1 ? 'ACTIVO' : 'INACTIVO'
            )
        }
    ];

    const rows = periodosAcademicos.map((periodo) => ({
        ...periodo,
        id: periodo.periodo_id,
        periodo_fecha_inicio: new Date(periodo.periodo_fecha_inicio).toLocaleDateString(),
        periodo_fecha_fin: new Date(periodo.periodo_fecha_fin).toLocaleDateString(),
    }));

    return (
        <div className="content">
            <h2 className="heading">Gestionar periodos académicos</h2>
            <button className="button pulse btn-primary" onClick={abrirModal}>
                Crear Periodo Académico
            </button>
            <h3 className="heading">Periodos académicos existentes</h3>
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
                    onRowSelectionModelChange={(newSelection) => manejarSeleccionPeriodo(newSelection)}
                    selectionModel={selectionModel}
                />
            </div>
            <button className="button pulse btn-primary" onClick={manejarConsultarPeriodo}>
                Consultar Periodo Académico
            </button>
            <button className="button pulse btn-primary" onClick={manejarEditarPeriodo}>
                Editar Periodo Académico
            </button>

            <ModalWindow isOpen={esModalAbierto} onClose={cerrarModal}>
                <h2>Crear Periodo Académico</h2>
                <div className="modal-content">
                    <div className="modal-row">
                        <label>Nombre:</label>
                        <input
                            type="text"
                            name="periodo_nombre"
                            value={nuevoPeriodo.periodo_nombre}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Fecha de Inicio:</label>
                        <DatePicker
                            selected={nuevoPeriodo.periodo_fecha_inicio}
                            onChange={(date) => setNuevoPeriodo({ ...nuevoPeriodo, periodo_fecha_inicio: date })}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Seleccionar fecha de inicio"
                        />
                    </div>
                    <div className="modal-row">
                        <label>Fecha de Fin:</label>
                        <DatePicker
                            selected={nuevoPeriodo.periodo_fecha_fin}
                            onChange={(date) => setNuevoPeriodo({ ...nuevoPeriodo, periodo_fecha_fin: date })}
                            dateFormat="yyyy-MM-dd"
                            placeholderText="Seleccionar fecha de fin"
                            minDate={nuevoPeriodo.periodo_fecha_inicio}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Programas:</label>
                        <div>
                            {programas.map((programa) => (
                                <div key={programa.id}>
                                    <input
                                        type="checkbox"
                                        value={programa.id}
                                        checked={nuevoPeriodo.programas.includes(programa.id)}
                                        onChange={manejarCambioProgramas}
                                    />
                                    {programa.programa_nombre}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="modal-buttons">
                    <button onClick={cerrarModal} className="button pulse btn-primary">
                        Salir
                    </button>
                    <button onClick={manejarGuardarPeriodo} className="button pulse btn-primary">
                        Guardar cambios
                    </button>
                </div>
            </ModalWindow>

            <ModalWindow isOpen={esModalConsultaAbierto} onClose={cerrarModalConsulta}>
                <h2>Editar Periodo Académico</h2>
                {periodoSeleccionado && (
                    <div className="modal-content">
                        <div className="modal-row">
                            <label>Nombre:</label>
                            <input
                                type="text"
                                name="periodo_nombre"
                                value={periodoSeleccionado.periodo_nombre}
                                onChange={(e) =>
                                    setPeriodoSeleccionado({ ...periodoSeleccionado, periodo_nombre: e.target.value })
                                }
                            />
                        </div>
                        <div className="modal-row">
                            <label>Fecha de Inicio:</label>
                            <DatePicker
                                selected={new Date(periodoSeleccionado.periodo_fecha_inicio)}
                                onChange={(date) =>
                                    setPeriodoSeleccionado({ ...periodoSeleccionado, periodo_fecha_inicio: date })
                                }
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Seleccionar fecha de inicio"
                            />
                        </div>
                        <div className="modal-row">
                            <label>Fecha de Fin:</label>
                            <DatePicker
                                selected={new Date(periodoSeleccionado.periodo_fecha_fin)}
                                onChange={(date) =>
                                    setPeriodoSeleccionado({ ...periodoSeleccionado, periodo_fecha_fin: date })
                                }
                                dateFormat="yyyy-MM-dd"
                                placeholderText="Seleccionar fecha de fin"
                                minDate={new Date(periodoSeleccionado.periodo_fecha_inicio)}
                            />
                        </div>
                        <div className="modal-row">
                            <label>Programas:</label>
                            <div>
                                {programas.map((programa) => (
                                    <div key={programa.id}>
                                        <input
                                            type="checkbox"
                                            value={programa.id}
                                            checked={periodoSeleccionado.programas.includes(programa.id)}
                                            onChange={manejarCambioProgramasSeleccionado}
                                        />
                                        {programa.programa_nombre}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="modal-row centered-button">
                            <label>Estado:</label>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={periodoSeleccionado.periodo_estado === 1}
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
                    <button onClick={manejarGuardarCambiosPeriodo} className="button pulse btn-primary">Guardar Cambios</button>
                </div>
            </ModalWindow>

        </div>
    );
};

export default GestionPeriodosAcademicos;
