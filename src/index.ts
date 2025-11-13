import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port: number = 3000;

// Middleware para parsear JSON en requests
app.use(express.json());
interface Vehiculo {
    id: number,
    brand: string,
    model: string,
    year: number,
    available: boolean
}
const vehicles: Vehiculo[] = [
    { id: 1, brand: "Toyota", model: "Hilux", year: 2020, available: true },
    { id: 2, brand: "Chevrolet", model: "Spark", year: 2018, available: false }
];

/* GET */
app.get("/get", (req: Request, res: Response) => {
    res.status(200).json(vehicles);
});

app.get("/disponible", (req: Request, res: Response) => {
    const dispo = vehicles.filter(g => g.available === true);
    res.status(200).json(dispo);
})
/* POST */
app.post("/post", (req: Request, res: Response) => {
    const { brand, model, year } = req.body;
    if (!brand || !model || !year) {
        return res.status(201).json({ message: "Faltan datos del vehiculo." });
    }
    const lastVehicle = vehicles[vehicles.length - 1];
    const newId = lastVehicle ? lastVehicle.id + 1 : 1;

    const nuevoVehiculo: Vehiculo = {
        id: newId, brand, model, year, available: true,
    };
    vehicles.push(nuevoVehiculo);
    res.status(203).json({ message: "Vehicle added successfully", vehicles: nuevoVehiculo, });
});
/* PUT */
app.put("/put/:id", (req: Request, res: Response) => {
    const id = Number(req.params["id"]); // 👈 forma segura para convertir el id
    const { brand, model, year, available }: Vehiculo = req.body;

    const index = vehicles.findIndex(v => v.id === id);
    if (index === -1) {
        return res.status(204).json({ message: "El vehículo no está registrado" });
    }

    vehicles[index] = { id, brand, model, year, available };
    res.status(200).json({
        message: "Vehículo actualizado correctamente",
        vehicle: vehicles[index],
    });
});
/* PATCH */
app.patch("/patch/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { year } = req.body;

    const index = vehicles.findIndex(g => g.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "Car not found" });
    }

    if (year !== undefined) {
        (vehicles[index] as Vehiculo).year = year;

    }

    res.status(200).json({
        message: "Año actualizado correctamente",
        vehicle: vehicles[index]
    });
});
/* DELETE */
app.delete("/delete/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);

    const index = vehicles.findIndex(g => g.id === id);

    if (index === -1) {
        return res.status(404).json({ message: "El vehiculo no esta registrado" });
    }

    const deletedVehicle = vehicles.splice(index, 1)[0];

    res.status(200).json({
        message: "Vehicle deleted successfully",
        deleted: deletedVehicle
    });
});

app.listen(port, () => {
    console.log(`El ejercicio esta corriendo en http://localhost:${port}`);
});