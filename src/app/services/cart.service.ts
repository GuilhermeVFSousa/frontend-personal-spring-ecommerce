import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../model/cart-item';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();

  constructor() { }

  addToCart(theCartItem: CartItem) {

    // verificar se já há item no carrinho
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;

    if (this.cartItems.length > 0) {

      // procurar o item com base em seu ID


//      for(let tempCartItem of this.cartItems) {
//        if(tempCartItem.id === theCartItem.id) {
//          existingCartItem = tempCartItem;
//          break;
//        }
//      }

// refatorado
    existingCartItem = this.cartItems.find( tempCartItems => tempCartItems.id === theCartItem.id )!;

      // verificar se o item foi encontrado
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    if(alreadyExistsInCart) {
      // caso exista no cart, será incrementada a quantidade desse item
      existingCartItem.quantidade++;
    }
    else {
      //caso não existingCartItem, adicionar o item ao array cartItems
      this.cartItems.push(theCartItem);
    }

    // calcular o preço total e a quantidade total do carrinho
    this.computeCartTotals();
  }

  computeCartTotals() {

    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantidade * currentCartItem.unidadePreco;
      totalQuantityValue += currentCartItem.quantidade;
    }

    // publicar os novos valores => todos subscribers irão receber os novos dados
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);
    localStorage.setItem('teste', JSON.stringify(totalPriceValue));
    localStorage.setItem('teste2', JSON.stringify(totalQuantityValue));

    this.logCartData(totalPriceValue, totalQuantityValue);
  }
  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for(let tempCartItem of this.cartItems) {
      const subTotalPrice =tempCartItem.quantidade * tempCartItem.unidadePreco;
      console.log(`nome: ${tempCartItem.nome}, quantidade=${tempCartItem.quantidade}, unidadePreco=${tempCartItem.unidadePreco}, subTotalPrice=${subTotalPrice}`);
    }
    console.log(`totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`) // toFixed(2) = 2 casas decimais após a vírgula
    console.log('-----------');
  }

}
