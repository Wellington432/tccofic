import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

//interface define os dados que serão usados com tipagem
interface CreateUserRequest{
    nome:string;
    email:string;
    senha:string;
}

class CreateUserService{

    async execute({nome, email, senha}: CreateUserRequest){
          //lógica para executar o requisito

          if(!nome || !email || !senha){
              throw new Error("Dados ausentes!");
          }

          if(senha.length < 8){
              throw new Error("A senha deve ter ao menos 8 caracteres!");
          }

          const emailExists = await prismaClient.usuario.findFirst({
            where:{
                email: email
            }
          })

          if(emailExists){
             throw new Error("Email já Cadastrado!");
          }

        const senhaHash = await hash(senha, 8);

          const user = await prismaClient.usuario.create({
              data:{
                  nome:nome,
                  email:email,
                  senha:senhaHash
              },
              select:{
                id:true,
                nome:true,
                email:true
              }
          });

          return user;
    }
}

//torna a classe pública
export {CreateUserService}