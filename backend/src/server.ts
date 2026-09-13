import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { router } from './routes';
import cors from 'cors';
import { Prisma } from '@prisma/client';

const app = express();
app.use(cors({ origin: /^http:\/\/localhost(:\d+)?$/, credentials: true }));
app.use(express.json());
app.use('/uploads', (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
}, express.static(path.resolve(__dirname, '..', 'uploads')));
app.use(router);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
            return res.status(404).json({ error: 'Registro não encontrado.' });
        }
        return res.status(400).json({ error: 'Erro na operação com o banco de dados.' });
    }

    if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(3333, () => console.log('SERVER ON'));