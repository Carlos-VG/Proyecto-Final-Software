import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GestionDocentes from '../Docentes/GestionDocentes';
import GestionPeriodosAcademicos from '../PeriodosAcademicos/GestionPeriodosAcademicos';
import './CoordinadorView.css';

const CoordinadorView = () => {
  const [mostrarDocentes, setMostrarDocentes] = useState(false);
  const [mostrarPeriodosAcademicos, setMostrarPeriodosAcademicos] = useState(false);

  const manejarClickDocentes = () => {
    setMostrarDocentes(true);
    setMostrarPeriodosAcademicos(false);
  };
  const manejarClickPeriodosAcademicos = () => {
    setMostrarPeriodosAcademicos(true);
    setMostrarDocentes(false);
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
          <a className="menu-item pulse btn-primary" onClick={manejarClickPeriodosAcademicos}>
            <span>Periodos Académicos</span>
          </a>
          <a className="menu-item pulse btn-primary" onClick={manejarClickDocentes}>
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
        {!mostrarPeriodosAcademicos && !mostrarDocentes && <div className="welcome-message">¡Bienvenido!</div>}
        
        {mostrarPeriodosAcademicos && <GestionPeriodosAcademicos />}
        {mostrarDocentes && <GestionDocentes />}
      </div>
    </div>
  );
};

export default CoordinadorView;
