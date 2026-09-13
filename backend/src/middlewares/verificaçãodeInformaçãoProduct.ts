import { z } from "zod"
import {
  Request,
  Response,
  NextFunction
} from "express"

interface Product {
  nome: string
  preco: number
  category: number
  data: string
  banner: string
}

const verificacao = z.object({
  nome: z
    .string()
    .min(3, "Nome precisa ter ao menos 3 caracteres"),

  preco: z
    .number()
    .positive("Valor não pode ser letra"),

  category: z
    .number()
    .int({ message: "Valor tem que ser inteiro" })
    .positive(),

  data: z
    .string()
    .datetime({ message: "Data inválida" }),



  banner: z
    .string()
    .url({ message: "Deve ser passada uma URL da imagem" })
})



export function Product(
  req: Request,
  res: Response,
  next: NextFunction
) {

 
  const produto = verificacao.parse(req.body)

  req.body = produto

  next()


}