interface Produto {
  id: string
  nome: string
  preco: string
  unidade: string
  descricao: string
  banner: string
  categoria: { id: string; nome: string }
}

interface Props {
  produto: Produto
}

export default function ProductCard({ produto }: Props) {
  const preco = parseFloat(produto.preco).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })

  return (
    <div className="card overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className="h-44 bg-horta-100 overflow-hidden">
        <img
          src={produto.banner}
          alt={produto.nome}
          className="w-full h-full object-cover"
          onError={(e) => {
            ;(e.target as HTMLImageElement).src =
              'https://placehold.co/400x300/d1fae5/166534?text=Produto'
          }}
        />
      </div>

      <div className="p-4">
        <span className="inline-block text-xs font-semibold text-horta-700 bg-horta-100 px-2 py-0.5 rounded-full mb-2">
          {produto.categoria.nome}
        </span>
        <h3 className="font-semibold text-gray-800 text-base leading-tight mb-1">
          {produto.nome}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-3">{produto.descricao}</p>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-horta-800 font-bold text-lg">{preco}</span>
            <span className="text-gray-400 text-sm ml-1">/ {produto.unidade}</span>
          </div>
          <button className="bg-horta-700 hover:bg-horta-800 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
            Adicionar
          </button>
        </div>
      </div>
    </div>
  )
}
