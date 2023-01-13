import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produto } from '../model/produto';
import { API_CONFIG } from '../config/api.config';
import { map, Observable } from 'rxjs';
import { ProdutoCategoria } from '../model/produto-categoria';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

  constructor(private httpClient: HttpClient) { }

  getProdutoList(categoriaId: number): Observable<Produto[]> {

    return this.httpClient.get<GetResponseProdutos>(`${API_CONFIG.baseUrl}/api/produtos/search/findByCategoriaId?id=${categoriaId}`).pipe(
      map(response => response._embedded.produtos)
    )
  }

  getProdutoCategorias(): Observable<ProdutoCategoria[]> {
    return this.httpClient.get<GetResponseProdutoCategoria>(`${API_CONFIG.baseUrl}/api/produto-categoria`).pipe(
      map(response => response._embedded.produtoCategoria)
    );
  }

}

interface GetResponseProdutos {
  _embedded: {
    produtos: Produto[]
  }
}

interface GetResponseProdutoCategoria {
  _embedded: {
    produtoCategoria: ProdutoCategoria[]
  }
}
