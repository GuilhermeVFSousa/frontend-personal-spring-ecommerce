import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../model/produto';

@Component({
  selector: 'app-produto-list',
  templateUrl: './produto-list-grid.component.html',
  // templateUrl: './produto-list.component.html',
  styleUrls: ['./produto-list.component.css']
})
export class ProdutoListComponent implements OnInit {

  produtos: Produto[] = [];

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.listProdutos();
  }
  listProdutos() {
    this.produtoService.getProdutoList().subscribe(
      data => {
        this.produtos = data;
      }
    );
  }

}
