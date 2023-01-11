export class Produto {

  constructor(
    public sku: string,
    public nome: string,
    public descricao: string,
    public unidadePreco: number,
    public imageUrl: string,
    public ativo: boolean,
    public unidadeEmEstoque: number,
    public dataCriacao: Date,
    public ultimoUpdated: Date
  ) {

  }

}
