// GestionDocentes.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ModalWindow from '../ModalWindow/ModalWindow';
import '../index/CoordinadorView.css';

const GestionDocentes = () => {
    const [docentes, setDocentes] = useState([]);
    const [docenteSeleccionado, setDocenteSeleccionado] = useState(null);
    const [esModalAbierto, setEsModalAbierto] = useState(false);
    const [nuevoDocente, setNuevoDocente] = useState({
        docente_Nombres: '',
        docente_Apellidos: '',
        docente_tipoIdentificacion: 'CC',
        docente_identificacion: '',
        Docente_tipo: '',
        Docente_tipoContrato: '',
        Docente_Area: '',
        contrasena: '',
        Docente_estado: 1
    });

    useEffect(() => {
        obtenerDocentes();
    }, []);

    const obtenerDocentes = async () => {
        try {
            const response = await axios.get('/api/docentes');
            setDocentes(response.data);
        } catch (error) {
            console.error('Error al obtener docentes:', error);
        }
    };

    const manejarSeleccionDocente = (docente) => {
        setDocenteSeleccionado(docente);
    };

    const manejarConsultarDocente = () => {
        if (docenteSeleccionado) {
            console.log('Consultando docente:', docenteSeleccionado);
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
        setNuevoDocente({
            ...nuevoDocente,
            [name]: value
        });
    };

    const manejarGuardarDocente = async () => {
        try {
            await axios.post('/api/docentes', nuevoDocente);
            obtenerDocentes();
            cerrarModal();
        } catch (error) {
            console.error('Error al guardar docente:', error);
        }
    };

    return (
        <div className="content">
            <h2 className="heading">Gestionar docentes</h2>
            <button className="button pulse btn-primary" onClick={abrirModal}>
                crear docente
            </button>
            <h3 className="heading">Docentes existentes</h3>
            <table className="table">
                <thead>
                    <tr>
                        <th>Selección</th>
                        <th>Nombre</th>
                        <th>Tipo de Contrato</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {docentes.map((docente) => (
                        <tr key={docente.docente_id}>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={docenteSeleccionado === docente}
                                    onChange={() => manejarSeleccionDocente(docente)}
                                />
                            </td>
                            <td>{docente.docente_Nombres} {docente.docente_Apellidos}</td>
                            <td>{docente.Docente_tipoContrato}</td>
                            <td>{docente.Docente_estado === 1 ? 'Activo' : 'Inactivo'}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button className="button pulse btn-primary" onClick={manejarConsultarDocente}>
                consultar docente
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
                        <label>Contraseña:</label>
                        <input
                            type="password"
                            name="contrasena"
                            value={nuevoDocente.contrasena}
                            onChange={manejarCambioEntrada}
                        />
                    </div>
                    <div className="modal-row">
                        <label>Estado:</label>
                        <select
                            name="Docente_estado"
                            value={nuevoDocente.Docente_estado}
                            onChange={manejarCambioEntrada}
                        >
                            <option value={1}>Activo</option>
                            <option value={0}>Inactivo</option>
                        </select>
                    </div>
                </div>
                <div className="modal-buttons">
                    <button onClick={cerrarModal} className="button pulse btn-primary">
                        Salir
                    </button>
                    <button onClick={manejarGuardarDocente} className="button pulse btn-primary">
                        Guardar cambios
                    </button>
                </div>
            </ModalWindow>
        </div>
    );
};

export default GestionDocentes;
