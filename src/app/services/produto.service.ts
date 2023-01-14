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
    const searchURL = `${API_CONFIG.baseUrl}/api/produtos/search/findByCategoriaId?id=${categoriaId}`

    return this.getProdutos(searchURL);
  }

  searchProdutos(theKeyword: string): Observable<Produto[]> {
    const searchURL = `${API_CONFIG.baseUrl}/api/produtos/search/findByNomeContaining?nome=${theKeyword}`

    return this.getProdutos(searchURL);
  }

  private getProdutos(searchURL: string): Observable<Produto[]> {
    return this.httpClient.get<GetResponseProdutos>(searchURL).pipe(
      map(response => response._embedded.produtos)
    );
  }

  getProdutoCategorias(): Observable<ProdutoCategoria[]> {
    const searchURL = `${API_CONFIG.baseUrl}/api/produto-categoria`

    return this.httpClient.get<GetResponseProdutoCategoria>(searchURL).pipe(
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
