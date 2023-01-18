import { Produto } from './produto';
export class CartItem {

  id: number;
  nome: string;
  imageUrl: string;
  unidadePreco: number;

  quantidade: number;

  constructor(produto: Produto) {
    this.id = produto.id;
    this.nome = produto.nome;
    this.imageUrl = produto.imageUrl;
    this.unidadePreco = produto.unidadePreco;

    this.quantidade = 1;
  }

}
