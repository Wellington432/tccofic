import prismaClient from "../../prisma";


interface ListUserRequest{
    id: string;
}

class ListUserByIdService{

    async execute({id}: ListUserRequest){

        if(!id){
            throw new Error("Dados ausentes!");
        }

        const user = await prismaClient.usuario.findFirst({
            where:{
                id:id
            },
            select:{
                id:true,
                nome:true,
                email:true,
                tipo:true
            }
        });

        return user;
    }
}
export {ListUserByIdService}