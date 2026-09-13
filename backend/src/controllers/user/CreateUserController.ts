
import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserServices";

class CreateUserController{

    async handle(req:Request, res:Response){

        //desconstruir o JSON recebido do cliente:
        const {nome, email, senha} = req.body;

        //objetivo de classe Service
        const createUser = new CreateUserService();

        //executar o serviço 
        const user = await createUser.execute({nome, email, senha});

        //retornar uma resposta ao cliente
        res.json(user);
    }
}

export {CreateUserController}