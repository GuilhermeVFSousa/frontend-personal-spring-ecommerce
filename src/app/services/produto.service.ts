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

  getProduto(theProdutoId: number): Observable<Produto> {
    const produtoURL = `${API_CONFIG.baseUrl}/api/produtos/${theProdutoId}`

    return this.httpClient.get<Produto>(produtoURL);
  }

  getProdutoListPaginate(thePage: number,thePageSize: number, categoriaId: number): Observable<GetResponseProdutos> {
    const searchURL = `${API_CONFIG.baseUrl}/api/produtos/search/findByCategoriaId?id=${categoriaId}`+`&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProdutos>(searchURL);
  }

  getProdutoList(categoriaId: number): Observable<Produto[]> {
    const searchURL = `${API_CONFIG.baseUrl}/api/produtos/search/findByCategoriaId?id=${categoriaId}`

    return this.getProdutos(searchURL);
  }

  searchProdutos(theKeyword: string): Observable<Produto[]> {
    const searchURL = `${API_CONFIG.baseUrl}/api/produtos/search/findByNomeContaining?nome=${theKeyword}`

    return this.getProdutos(searchURL);
  }

  searchProdutosPaginate(thePage: number,thePageSize: number, theKeyword: string): Observable<GetResponseProdutos> {
    const searchURL = `${API_CONFIG.baseUrl}/api/produtos/search/findByNomeContaining?nome=${theKeyword}`+`&page=${thePage}&size=${thePageSize}`

    return this.httpClient.get<GetResponseProdutos>(searchURL);
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
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProdutoCategoria {
  _embedded: {
    produtoCategoria: ProdutoCategoria[]
  }
}
