import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Produto } from '../model/produto';
import { API_CONFIG } from '../config/api.config';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {



  constructor(private httpClient: HttpClient) { }

  getProdutoList(categoriaId: number): Observable<Produto[]> {

    return this.httpClient.get<GetResponse>(`${API_CONFIG.baseUrl}/api/produtos/search/findByCategoriaId?id=${categoriaId}`).pipe(
      map(response => response._embedded.produtos)
    )
  }

}

interface GetResponse {
  _embedded: {
    produtos: Produto[]
  }
}
