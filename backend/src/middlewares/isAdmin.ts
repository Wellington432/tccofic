import { Request, Response, NextFunction } from "express";
import prismaClient from "../prisma";

export async function isAdmin(req: Request, res: Response, next: NextFunction) {
    const user = await prismaClient.usuario.findUnique({
        where: { id: req.user_id },
        select: { tipo: true }
    });

    if (user?.tipo !== 'ADM') {
        return res.status(403).json({ error: 'Acesso negado. Apenas administradores.' });
    }

    return next();
}
