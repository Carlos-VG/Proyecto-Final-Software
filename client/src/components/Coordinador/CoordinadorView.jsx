import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CoordinadorView.css';

const CoordinadorView = () => {
  const [showAcademicPeriods, setShowAcademicPeriods] = useState(false);
  const [academicPeriods, setAcademicPeriods] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  useEffect(() => {
    fetchAcademicPeriods();
  }, []);

  const fetchAcademicPeriods = async () => {
    try {
      const response = await axios.get('/api/academic-periods');
      setAcademicPeriods(response.data);
    } catch (error) {
      console.error('Error fetching academic periods:', error);
    }
  };

  const handleAcademicPeriodsClick = () => {
    setShowAcademicPeriods(true);
  };

  const handlePeriodSelect = (period) => {
    setSelectedPeriod(period);
  };

  const handleConsultPeriod = () => {
    if (selectedPeriod) {
      // Lógica para consultar el período seleccionado
      console.log('Consultando período:', selectedPeriod);
    }
  };

  return (
    <div className="coordinator-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="profile-picture"></div>
          <div className="profile-info">
            <div className="profile-name">Persona Name</div>
            <div className="profile-role">Coordinador</div>
          </div>
        </div>
        <div className="buttons-container">
          <a className="menu-item pulse btn-primary" onClick={handleAcademicPeriodsClick}>
            <span>Periodos Académicos</span>
          </a>
          <a className="menu-item pulse btn-primary">
            <span>Docentes</span>
          </a>
          <a className="menu-item pulse btn-primary">
            <span>Ambientes</span>
          </a>
          <a className="menu-item pulse btn-primary">
            <span>Programas</span>
          </a>
          <a className="menu-item pulse btn-primary">
            <span>Competencias</span>
          </a>
          <a className="menu-item pulse btn-primary">
            <span>Horarios</span>
          </a>
        </div>
      </div>
      <div className="content">
        {!showAcademicPeriods && <div className="welcome-message">¡Bienvenido!</div>}
        {showAcademicPeriods && (
          <>
            <h2 className="heading">Gestionar periodos académicos</h2>
            <button className="button pulse btn-primary">crear periodo académico</button>
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
                {academicPeriods.map((period) => (
                  <tr key={period.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedPeriod === period}
                        onChange={() => handlePeriodSelect(period)}
                      />
                    </td>
                    <td>{period.name}</td>
                    <td>{period.startDate}</td>
                    <td>{period.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button className="button pulse btn-primary" onClick={handleConsultPeriod}>
              consultar periodo académico
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CoordinadorView;
