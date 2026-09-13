import { Request, Response } from "express";
import { AuthGoogleUserService } from "../../services/user/AuthGoogleUserService";

class AuthGoogleUserController{

    async handle(req:Request, res:Response){

        const {credential} = req.body;

        const authGoogleUser = new AuthGoogleUserService();

        const user = await authGoogleUser.execute({credential});

        res.json(user);
    }
}

export {AuthGoogleUserController}
