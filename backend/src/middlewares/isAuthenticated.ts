/// <reference path="../@types/express/index.d.ts" />
import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface PayLoad{
    sub: string;
}

export function isAuthenticated(
    req: Request,
    res: Response,
    next: NextFunction
)
{
    const authToken = req.headers.authorization

    if(!authToken){
        return res.status(401).end();
    }

    const [, token] = authToken.split(" ");

    const secret = process.env.JWT_SECRET;
    if (!secret) return res.status(500).end();

    try{
        const {sub} = verify(token, secret) as PayLoad;

        req.user_id = sub

        return next();
    }
    catch(err){
        return res.status(401).end();
    }
}
