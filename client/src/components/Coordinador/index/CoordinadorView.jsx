import React, { useState, useEffect } from 'react';
import axios from 'axios';
import GestionAmbientes from '../Ambientes/GestionAmbientes';
import GestionCompetencias from '../Competencias/GestionCompetencias';
import GestionDocentes from '../Docentes/GestionDocentes';
import GestionPeriodosAcademicos from '../PeriodosAcademicos/GestionPeriodosAcademicos';
import GestionProgramas from '../Programas/GestionProgramas';
import './CoordinadorView.css';

const CoordinadorView = () => {
  const [mostrarAmbientes, setMostrarAmbientes] = useState(false);
  const [mostrarDocentes, setMostrarDocentes] = useState(false);
  const [mostrarCopetencias, setmostrarCopetencias] = useState(false);
  const [mostrarPeriodosAcademicos, setMostrarPeriodosAcademicos] = useState(false);
  const [mostrarProgramas, setMostrarProgramas] = useState(false);

  const manejarClickAmbientes = () => {
    setMostrarAmbientes(true);
    setmostrarCopetencias(false);
    setMostrarDocentes(false);
    setMostrarProgramas(false);
    setMostrarPeriodosAcademicos(false);
  };
  const manejarClickCopetencias = () => {
    setmostrarCopetencias(true);
    setMostrarProgramas(false);
    setMostrarAmbientes(false);
    setMostrarDocentes(false);
    setMostrarPeriodosAcademicos(false);
  };
  const manejarClickDocentes = () => {
    setMostrarDocentes(true);
    setmostrarCopetencias(false);
    setMostrarProgramas(false);
    setMostrarPeriodosAcademicos(false);
    setMostrarAmbientes(false);
  };
  const manejarClickProgramas = () => {
    setMostrarProgramas(true);
    setmostrarCopetencias(false);
    setMostrarAmbientes(false);
    setMostrarDocentes(false);
    setMostrarPeriodosAcademicos(false);
  };
  const manejarClickPeriodosAcademicos = () => {
    setMostrarPeriodosAcademicos(true);
    setmostrarCopetencias(false);
    setMostrarDocentes(false);
    setMostrarProgramas(false);
    setMostrarAmbientes(false);
  };
  

  return (
    <div className="coordinator-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="profile-picture"></div>
          <div className="profile-info">
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
          <a className="menu-item pulse btn-primary" onClick={manejarClickAmbientes} >
            <span>Ambientes</span>
          </a>
          <a className="menu-item pulse btn-primary" onClick={manejarClickProgramas} >
            <span>Programas</span>
          </a>
          <a className="menu-item pulse btn-primary" onClick={manejarClickCopetencias} >
            <span>Competencias</span>
          </a>
          <a className="menu-item pulse btn-primary">
            <span>Horarios</span>
          </a>
        </div>
      </div>

      <div className="content">
        {!mostrarPeriodosAcademicos && !mostrarDocentes && !mostrarAmbientes && !mostrarProgramas && mostrarCopetencias}

        {mostrarPeriodosAcademicos && <GestionPeriodosAcademicos />}
        {mostrarDocentes && <GestionDocentes />}
        {mostrarAmbientes && <GestionAmbientes />}
        {mostrarProgramas && <GestionProgramas />}
        {mostrarCopetencias && <GestionCompetencias />}
      </div>
    </div>
  );
};

export default CoordinadorView;
