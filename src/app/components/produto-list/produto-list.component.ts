import { Component, OnInit } from '@angular/core';
import { ProdutoService } from '../../services/produto.service';
import { Produto } from '../../model/produto';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-produto-list',
  templateUrl: './produto-list-grid.component.html',
  styleUrls: ['./produto-list.component.css']
})
export class ProdutoListComponent implements OnInit {

  produtos: Produto[] = [];

  currentCategoriaId: number = 1;

  constructor(
    private produtoService: ProdutoService,
    private route:  ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProdutos();
      });
  }

  listProdutos() {

     // verificar se o parâmetro ID está disponível
     const hasCategoriaId: boolean = this.route.snapshot.paramMap.has('id');

     if(hasCategoriaId) {
      // obtem o parâmetro "ID" inicialmente como string. Convertemos para número usuando o sinal "+"
      this.currentCategoriaId = +this.route.snapshot.paramMap.get('id')!;
     } else {
      // caso não possua o id da categoria, retorna o id 1 por default
      this.currentCategoriaId = 1;
     }

     // obter os produtos pelo id da categoria
    this.produtoService.getProdutoList(this.currentCategoriaId).subscribe(
      data => {
        this.produtos = data;
      }
    );
  }

}
