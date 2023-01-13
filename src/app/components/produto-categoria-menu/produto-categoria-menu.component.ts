import { Component, OnInit } from '@angular/core';
import { ProdutoCategoria } from '../../model/produto-categoria';
import { ProdutoService } from '../../services/produto.service';

@Component({
  selector: 'app-produto-categoria-menu',
  templateUrl: './produto-categoria-menu.component.html',
  styleUrls: ['./produto-categoria-menu.component.css']
})
export class ProdutoCategoriaMenuComponent implements OnInit {

  produtoCategorias: ProdutoCategoria[] = [];

  constructor(private produtoService: ProdutoService) { }

  ngOnInit(): void {
    this.listProdutoCategorias();
  }

  listProdutoCategorias() {

    this.produtoService.getProdutoCategorias().subscribe(
      data => {
        console.log('Categorias dos Produtos=' + JSON.stringify(data));
        this.produtoCategorias = data;
      }
    )

  }

}
