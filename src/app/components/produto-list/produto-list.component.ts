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
  previousCategoriaId: number = 1;
  currentCategoriaNome: string = "";
  searchMode: boolean = false;

  //novas propriedades para Pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

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

    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if (this.searchMode) {
      this.handleSearchProdutos();
    }
    else {
      this.handleListProdutos();
    }

  }

  handleListProdutos() {
    // verificar se o parâmetro ID está disponível
    const hasCategoriaId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoriaId) {
     // obtem o parâmetro "ID" inicialmente como string. Convertemos para número usuando o sinal "+"
     this.currentCategoriaId = +this.route.snapshot.paramMap.get('id')!;
     this.currentCategoriaNome = this.route.snapshot.paramMap.get('nome')!;
    } else {
     // caso não possua o id da categoria, retorna o id 1 por default
     this.currentCategoriaId = 1;
     this.currentCategoriaNome = 'Books';
    }

    // verificar se temos um id da categoria diferente do anterior para que o angular reutilize o componente caso esteja sendo visualizado no browser


    // Caso possua um id de categoria diferente do anterior, setaremos o thePageNumber de volta a 1
    if(this.previousCategoriaId != this.currentCategoriaId) {
      this.thePageNumber = 1;
    }

    this.previousCategoriaId = this.currentCategoriaId;
    console.log(`currentCategoriaId=${this.currentCategoriaId}`)


    // obter os produtos pelo id da categoria
    this.produtoService.getProdutoListPaginate(this.thePageNumber - 1, this.thePageSize, this.currentCategoriaId)
          .subscribe(data => {this.produtos = data._embedded.produtos
                              this.thePageNumber = data.page.number + 1 // as paginações do spring são fornecidas a partir do 0
                              this.thePageSize = data.page.size
                              this.theTotalElements = data.page.totalElements});
  }

  handleSearchProdutos() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    // realizando a busca por palavras
    this.produtoService.searchProdutos(theKeyword).subscribe(
      data => {
        this.produtos = data;
      }
    )

  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize; // "+" converte pageSize para number
    this.thePageNumber = 1;
    this.listProdutos();
  }

}
