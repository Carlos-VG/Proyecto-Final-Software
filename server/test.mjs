import test from 'node:test';
import assert from 'node:assert/strict';
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000';

async function login() {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario: 'coordinador', password: 'coordinador' })
    });
    const data = await response.json();
    return data;
}

test('Setup: Login para obtener el token', async () => {
    const token = await login();
    assert.equal(token.status, 200);
});

test('Asignación horaria para un docente PT', async () => {
    const token = await login();
    const response = await fetch(`${BASE_URL}/api/horarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.body}`
        },
        body: JSON.stringify({
            horario_dia: "LUN",
            horario_hora_inicio: "13:00:00",
            horario_hora_fin: "17:00:00",
            docente_id: 1,
            periodo_id: 1,
            ambiente_id: "FIET101",
            competencia_id: 5,
            programa_id: 4
        })
    });
    const data = await response.json();
    assert.equal(data.body, 'Horario agregado satisfactoriamente');
});

test('Asignación horaria Para Docente PT no superior a 8 horas', async () => {
    const token = await login();
    const response = await fetch(`${BASE_URL}/api/horarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.body}`
        },
        body: JSON.stringify({
            horario_dia: "LUN",
            horario_hora_inicio: "08:00:00",
            horario_hora_fin: "13:00:00",
            docente_id: 1,
            periodo_id: 1,
            ambiente_id: "FIET101",
            competencia_id: 5,
            programa_id: 4
        })
    });
    const data = await response.json();
    assert.equal(data.error, 'El docente PT no puede tener más de 8 horas diarias');
});

test('Asignación horaria para docente CNT', async () => {
    const token = await login();
    const response = await fetch(`${BASE_URL}/api/horarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.body}`
        },
        body: JSON.stringify({
            horario_dia: "MAR",
            horario_hora_inicio: "08:00:00",
            horario_hora_fin: "13:00:00",
            docente_id: 3,
            periodo_id: 1,
            ambiente_id: "FIET101",
            competencia_id: 5,
            programa_id: 4
        })
    });
    const data = await response.json();
    assert.equal(data.body, 'Horario agregado satisfactoriamente');
});

test('Asignación horaria Para Docente CNT no superior a 10 horas', async () => {
    const token = await login();
    const response = await fetch(`${BASE_URL}/api/horarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.body}`
        },
        body: JSON.stringify({
            horario_dia: "MAR",
            horario_hora_inicio: "14:00:00",
            horario_hora_fin: "20:00:00",
            docente_id: 3,
            periodo_id: 1,
            ambiente_id: "FIET101",
            competencia_id: 5,
            programa_id: 4
        })
    });
    const data = await response.json();
    assert.equal(data.error, 'El docente CNT no puede tener más de 10 horas diarias');
});

test('Validación de no exceder 40 horas semanales para Docente CNT', async () => {
    const token = await login();
    const asignaciones = [
        { dia: "MAR", inicio: "14:00:00", fin: "19:00:00" }, // 5 horas
        { dia: "MIE", inicio: "08:00:00", fin: "18:00:00" }, // 10 horas
        { dia: "JUE", inicio: "08:00:00", fin: "18:00:00" }, // 10 horas
        { dia: "VIE", inicio: "08:00:00", fin: "18:00:00" }, // 10 horas
        { dia: "SAB", inicio: "08:00:00", fin: "09:00:00" }  // 1 hora
    ];
    const resultados = [];
    let data;

    for (const asignacion of asignaciones) {
        const response = await fetch(`${BASE_URL}/api/horarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token.body}`
            },
            body: JSON.stringify({
                horario_dia: asignacion.dia,
                horario_hora_inicio: asignacion.inicio,
                horario_hora_fin: asignacion.fin,
                docente_id: 3,
                periodo_id: 1,
                ambiente_id: "FIET101",
                competencia_id: 5,
                programa_id: 4
            })
        });
        data = await response.json();
    }

    assert.equal(data.error, 'El docente CNT no puede tener más de 40 horas semanales');

});

test('Validar disponibilidad de ambiente de aprendizaje', async () => {
    const token = await login();
    const response = await fetch(`${BASE_URL}/api/horarios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token.body}`
        },
        body: JSON.stringify({
            horario_dia: "LUN",
            horario_hora_inicio: "13:00:00",
            horario_hora_fin: "17:00:00",
            docente_id: 1,
            periodo_id: 1,
            ambiente_id: "FIET101",
            competencia_id: 5,
            programa_id: 4
        })
    });
    const data = await response.json();
    assert.equal(data.error, 'Espacio Ocupado o No disponible en la franja horario seleccionada');
});
