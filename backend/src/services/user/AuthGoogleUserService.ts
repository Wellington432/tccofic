import prismaClient from "../../prisma";
import { OAuth2Client } from "google-auth-library";
import { sign } from "jsonwebtoken";

interface AuthGoogleUserRequest {
    credential: string;
}

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

class AuthGoogleUserService{

    async execute({credential}:AuthGoogleUserRequest){

        if(!credential){
            throw new Error("Credencial do Google ausente.");
        }

        let payload;
        try {
            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID,
            });
            payload = ticket.getPayload();
        } catch {
            throw new Error("Não foi possível validar o login com Google.");
        }

        if(!payload){
            throw new Error("Não foi possível validar o login com Google.");
        }

        if(!payload.email_verified){
            throw new Error("E-mail do Google não verificado.");
        }

        const googleId = payload.sub;
        const email = payload.email as string;
        const nome = payload.name ?? email;

        let user = await prismaClient.usuario.findFirst({
            where: { googleId }
        });

        if(!user){
            user = await prismaClient.usuario.findFirst({
                where: { email }
            });

            if(user){
                user = await prismaClient.usuario.update({
                    where: { id: user.id },
                    data: { googleId }
                });
            }
        }

        if(!user){
            user = await prismaClient.usuario.create({
                data: {
                    nome,
                    email,
                    googleId,
                    senha: null,
                }
            });
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

export {AuthGoogleUserService}
