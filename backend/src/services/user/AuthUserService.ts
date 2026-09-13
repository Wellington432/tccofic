import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthUserRequest {
    email: string;
    senha: string;
}

class AuthUserService{

    async execute({email, senha}:AuthUserRequest){
        
        const user = await prismaClient.usuario.findFirst({
            where: {
                email:email
            }
        });

        if(!user){
            throw new Error("Usuário ou senha incorretos!");
        }

        if(!user.senha){
            throw new Error("Esta conta usa login com Google. Entre com o Google.");
        }

        const senhaMatch = await compare(senha, user.senha);

        if(!senhaMatch){
            throw new Error("Usuário ou senha incorretos!")
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('Configuração de segurança ausente no servidor.');

        const token = sign(
            { nome: user.nome, usuario: user.email },
            secret,
            { subject: user.id, expiresIn: '1h' }
        );

    return{
        id:user.id,
        nome:user.nome,
        email:user.email,
        tipo:user.tipo,
        token:token
    }

     
   
    }
}

export {AuthUserService}