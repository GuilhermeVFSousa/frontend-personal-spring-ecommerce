import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../model/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {

    // get a handle to the dart items
    this.cartItems = this.cartService.cartItems

    // subscribe ao totalprice do cart
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    )

    // subscribe ao totalQuantity do cart
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    )

    // calcular total price e quantity do cart
    this.cartService.computeCartTotals();

  }

  incrementQuantity(theCartItem: CartItem) {
    this.cartService.addToCart(theCartItem);
  }

  decrementQuantity(theCartItem: CartItem) {
    this.cartService.decrementQuantity(theCartItem);

  }

  remove(theCartItem: CartItem) {
    this.cartService.remove(theCartItem);
  }

}
