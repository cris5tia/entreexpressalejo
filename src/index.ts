import express, { Express, Request, Response } from "express";
import { Level } from "./curso";

const app: Express = express();
const PORT = 3000;

app.use(express.json());

export interface Course {
    id: number;
    title: string;
    description: string;
    durationHours: number;
    level: Level;
}


let courses: Course[] = [
    {
        id: 1,
        title: "Introducción a TypeScript",
        description: "Curso básico para aprender TypeScript desde cero.",
        durationHours: 10,
        level: Level.BASICO,
    },
    {
        id: 2,
        title: "JavaScript Avanzado",
        description: "Conceptos avanzados del lenguaje JS.",
        durationHours: 15,
        level: Level.AVANZADO,
    },
    {
        id: 3,
        title: "Desarrollo Web",
        description: "HTML, CSS y JS para principiantes.",
        durationHours: 20,
        level: Level.INTERMEDIO,
    },
];

app.get("/courses", (req: Request, res: Response) => {
    const { id, title, description, durationHours, level } = req.query;

    const filtered = courses.filter((el) => {
        const idFilter = id === undefined || el.id === parseInt(String(id));
        const titleFilter = title === undefined || el.title === String(title);
        const descFilter =
            description === undefined || el.description === String(description);
        const durationFilter =
            durationHours === undefined ||
            el.durationHours === parseInt(String(durationHours));
        const levelFilter = level === undefined || el.level === (level as Level);


        return (
            idFilter &&
            titleFilter &&
            descFilter &&
            durationFilter &&
            levelFilter
        );
    });

    res.status(200).json(filtered);
});

app.get("/courses/:id", (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id));

    const course = courses.find((el) => el.id === id);

    if (!course) {
        return res.status(404).json({ message: "Curso no encontrado" });
    }

    res.status(200).json(course);
});

app.post("/courses", (req: Request, res: Response) => {
    const body: Course = req.body;

    if (
        typeof body.title !== "string" ||
        typeof body.description !== "string" ||
        typeof body.durationHours !== "number" ||
        !Object.values(Level).includes(body.level)
    ) {
        return res.status(400).json({
            message: "Datos inválidos, verifica los tipos enviados.",
        });
    }

    body.id = courses.length + 1;
    courses.push(body);

    res.status(201).json(body);
});

app.patch("/courses/:id", (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id));

    const body: Partial<Course> = req.body;

    courses = courses.map((el) =>
        el.id === id ? { ...el, ...body } : el
    );

    res.status(204).send();
});

app.delete("/courses/:id", (req: Request, res: Response) => {
    const id = parseInt(String(req.params.id));

    courses = courses.filter((el) => el.id !== id);

    res.status(204).send();
});

app.listen(PORT, () =>
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
);
