import { CartItem } from '../model/cart-item';
export class OrderItem {
  imageUrl: string;
  unidadePreco: number;
  quantidade: number;
  produtoId: string;

  constructor(cartItem: CartItem) {
    this.imageUrl = cartItem.imageUrl;
    this.unidadePreco = cartItem.unidadePreco;
    this.quantidade = cartItem.quantidade;
  }
}
