// GestionPeriodosAcademicos.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalWindow from '../ModalWindow/ModalWindow';
import '../index/CoordinadorView.css';

const GestionPeriodosAcademicos = () => {
    const [periodosAcademicos, setPeriodosAcademicos] = useState([]);
    const [periodoSeleccionado, setPeriodoSeleccionado] = useState(null);
    const [esModalAbierto, setEsModalAbierto] = useState(false);
    const [nuevoPeriodo, setNuevoPeriodo] = useState({
        periodo: '',
        fechaInicio: '',
        fechaFin: '',
        estado: 'Activo'
    });

    useEffect(() => {
        obtenerPeriodosAcademicos();
    }, []);

    const obtenerPeriodosAcademicos = async () => {
        try {
            const response = await axios.get('/api/academic-periods');
            setPeriodosAcademicos(response.data);
        } catch (error) {
            console.error('Error al obtener periodos académicos:', error);
        }
    };

    const manejarSeleccionPeriodo = (periodo) => {
        setPeriodoSeleccionado(periodo);
    };

    const manejarConsultarPeriodo = () => {
        if (periodoSeleccionado) {
            console.log('Consultando período:', periodoSeleccionado);
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
        setNuevoPeriodo({
            ...nuevoPeriodo,
            [name]: value
        });
    };

    const manejarGuardarPeriodo = () => {
        console.log('Nuevo período académico:', nuevoPeriodo);
        cerrarModal();
    };

    return (
        <div className="content">
            <h2 className="heading">Gestionar periodos académicos</h2>
            <button className="button pulse btn-primary" onClick={abrirModal}>
                crear periodo académico
            </button>
            <h3 className="heading">Periodos académicos existentes</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Selección</th>
                        <th>Periodo</th>
                        <th>Inicio</th>
                        <th>Fin</th>
                    </tr>
                </thead>
                <tbody>
                    {periodosAcademicos.map((periodo) => (
                        <tr key={periodo.id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={periodoSeleccionado === periodo}
                                    onChange={() => manejarSeleccionPeriodo(periodo)}
                                />
                            </td>
                            <td>{periodo.name}</td>
                            <td>{periodo.startDate}</td>
                            <td>{periodo.endDate}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="button pulse btn-primary" onClick={manejarConsultarPeriodo}>
                consultar periodo académico
            </button>

            <ModalWindow isOpen={esModalAbierto} onClose={cerrarModal}>
                <h2>Gestión de Estado y Modificación del Período Académico</h2>
                <div className="modal-content">
                    <div className="modal-row">
                        <label>Período:</label>
                        <input
                            type="text"
                            name="periodo"
                            value={nuevoPeriodo.periodo}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Inicio:</label>
                        <input
                            type="date"
                            name="fechaInicio"
                            value={nuevoPeriodo.fechaInicio}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Fin:</label>
                        <input
                            type="date"
                            name="fechaFin"
                            value={nuevoPeriodo.fechaFin}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Estado:</label>
                        <select
                            name="estado"
                            value={nuevoPeriodo.estado}
                            onChange={manejarCambioEntrada}
                        >
                            <option value="Activo">Activo</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
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
        </div>
    );
};

export default GestionPeriodosAcademicos;
