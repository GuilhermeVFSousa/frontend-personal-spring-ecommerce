import { Component, OnInit } from '@angular/core';
import { Produto } from '../../model/produto';
import { ProdutoService } from '../../services/produto.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-produto-details',
  templateUrl: './produto-details.component.html',
  styleUrls: ['./produto-details.component.css']
})
export class ProdutoDetailsComponent implements OnInit {

  produto!: Produto;

  constructor(
    private produtoService: ProdutoService,
    private route: ActivatedRoute
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

}
