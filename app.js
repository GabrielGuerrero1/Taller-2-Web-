const express = require('express');
const app = express();
app.set('json spaces', 2);
const PORT = 3000;

// ===== Ejercicio 1: Cálculo de IVA y Renta =====

function calcularIVA(monto) {
  return monto * 0.13;
}

function calcularRenta(monto) {
  return monto * 0.10;
}

app.get('/api/calcular/:monto', (req, res) => {
  try {
    const monto = Number(req.params.monto);

    if (!Number.isFinite(monto) || monto <= 0) {
      return res.status(400).json({
        error: 'El salario debe ser un número mayor a cero'
      });
    }

    const iva = calcularIVA(monto);
    const renta = calcularRenta(monto);

    res.json({ monto, iva, renta });
  } catch (error) {
    res.status(500).json({ error: 'Ocurrió un error procesando la solicitud' });
  }
});

// ===== Ejercicio 2: Costos de envío internacional =====

// Tarifas por país (USD por kg)
const tarifasPorPais = {
  elsalvador: 1.50,
  guatemala: 2.00,
  honduras: 2.25,
  nicaragua: 2.50,
  costarica: 3.00,
  panama: 3.50
};

function validarPais(pais) {
  if (!pais) {
    throw new Error('Debe indicar un país');
  }
  const paisNormalizado = pais.toLowerCase().trim();
  if (!tarifasPorPais.hasOwnProperty(paisNormalizado)) {
    throw new Error(
      `País no válido: "${pais}". Países permitidos: ${Object.keys(tarifasPorPais).join(', ')}`
    );
  }
  return paisNormalizado;
}

function validarPeso(peso) {
  const pesoNumerico = Number(peso);
  if (peso === undefined || peso === '' || isNaN(pesoNumerico)) {
    throw new Error('El peso debe ser un valor numérico');
  }
  if (pesoNumerico === 0) {
    throw new Error('El peso no puede ser igual a cero');
  }
  if (pesoNumerico < 0) {
    throw new Error('El peso no puede ser negativo');
  }
  return pesoNumerico;
}

function calcularEnvio(pais, peso) {
  const tarifaPorKg = tarifasPorPais[pais];
  const costoBase = peso * tarifaPorKg;

  let descuento = 0;
  let recargo = 0;

  // Descuento del 10% si el peso es mayor a 20kg
  if (peso > 20) {
    descuento = costoBase * 0.10;
  }

  // Recargo de $5.00 si el peso es menor a 1kg
  if (peso < 1) {
    recargo = 5.00;
  }

  const total = costoBase - descuento + recargo;

  return {
    pais,
    peso,
    tarifaPorKg,
    costoBase,
    descuento,
    recargo,
    total
  };
}

app.get('/api/envio/:pais/:peso', (req, res) => {
  try {
    const { pais, peso } = req.params;

    const paisValidado = validarPais(pais);
    const pesoValidado = validarPeso(peso);

    const resultado = calcularEnvio(paisValidado, pesoValidado);

    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  console.log(`Ejercicio 1: http://localhost:${PORT}/api/calcular/1000`);
  console.log(`Ejercicio 2: http://localhost:${PORT}/api/envio/elsalvador/10`);
});
