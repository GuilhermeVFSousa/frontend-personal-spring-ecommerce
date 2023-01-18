import { Component, OnInit } from '@angular/core';
import { Produto } from '../../model/produto';
import { ProdutoService } from '../../services/produto.service';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../models/cart-item';

@Component({
  selector: 'app-produto-details',
  templateUrl: './produto-details.component.html',
  styleUrls: ['./produto-details.component.css']
})
export class ProdutoDetailsComponent implements OnInit {

  produto!: Produto;

  constructor(
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private cartService: CartService
    ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.handleProdutoDetails();
    })
  }

  handleProdutoDetails() {
    //obter o parametro id da string. converter a strinf para number com o "+"
    const theProdutoId: number = +this.route.snapshot.paramMap.get('id')!;

    this.produtoService.getProduto(theProdutoId).subscribe(
      data => {
        this.produto = data;
      }
    )
  }

  addToCart() {
    const theCartItem = new CartItem(this.produto);
    this.cartService.addToCart(theCartItem);

    console.log(`nome: ${this.produto.nome}, unidadePreco=${this.produto.unidadePreco}`);
  }

}
