import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../Login/login'; // Importar useAuth
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './style.css';
import UserIcon from './IcBaselinePermIdentity.svg'; // Importar el SVG

const DocenteView = () => {
  const { token, logout } = useAuth(); // Inicializar useAuth
  const navigate = useNavigate(); // Inicializar useNavigate
  const [showHorarios, setShowHorarios] = useState(false);
  const [horarios, setHorarios] = useState([]);
  const [profesor, setProfesor] = useState({ nombres: '', apellidos: '', identificacion: '' }); // Estado para los datos del profesor

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/docentes/unDocente', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProfesor({
          nombres: response.data.body.docente_Nombres,
          apellidos: response.data.body.docente_Apellidos,
          identificacion: response.data.body.docente_identificacion
        });
        console.log('Docente data:', response.data.body);
      } catch (error) {
        console.error('Error fetching docente data:', error);
      }
    };

    fetchData();
  }, [token]);

  const handleHorariosClick = () => {
    setShowHorarios(!showHorarios);
  };

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirigir a la pantalla de inicio de sesión
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row top-bar">
        <div className="col-12">
        </div>
      </div>
      <div className="row no-gutters">
        <div className="col-md-2 p-4 barra">
          <div className="text-center mb-4">
            <div className="bg-primary text-white p-4 rounded-circle mb-3 mx-auto user-icon">
              <img src={UserIcon} alt="User Icon" className="icon" />
            </div>
            <p className="mb-0 user-name">{`${profesor.nombres} ${profesor.apellidos}`}</p>
            <p className="mb-0 user-name">Identificación: {`${profesor.identificacion}`}</p>
            <p className="text-muted user-role">Docente</p>
          </div>
          <div className="custom-button" onClick={handleHorariosClick}>
            <h5 className="mb-0">Horarios</h5>
          </div>
          <button className="danger-button w-100 mt-4" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
        <div className="col-md-10 p-4 main-content ">
          <h2>Gestionar Horarios</h2>
          {showHorarios && (
            <div>
              <table className="table table-striped mt-3">
                <thead className="thead-dark">
                  <tr>
                    <th>Selección</th>
                    <th>Horario</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                  </tr>
                </thead>
                <tbody>
                  {horarios.map((horario, index) => (
                    <tr key={index}>
                      <td><input type="checkbox" /></td>
                      <td>{horario.nombre}</td>
                      <td>{horario.inicio}</td>
                      <td>{horario.fin}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DocenteView;
