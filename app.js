const express = require("express");

const app = express();
const PORT = 3000;

function calcularIVA(monto) {
    return monto * 0.13;
}

function calcularRenta(monto) {
    return monto * 0.10;
}

app.get("/api/calcular/:monto", (req, res) => {
    const monto = Number(req.params.monto);

    if (!Number.isFinite(monto) || monto <= 0) {
        return res.status(400).json({
            error: "El salario debe ser un número mayor a cero"
        });
    }

    const iva = calcularIVA(monto);
    const renta = calcularRenta(monto);

    res.json({
        monto: monto,
        iva: iva,
        renta: renta
    });
});

app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});