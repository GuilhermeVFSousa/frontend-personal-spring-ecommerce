import { API_CONFIG } from './../config/api.config';
import { Injectable } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Pais } from '../models/pais';
import { Estado } from '../models/estado';
import { Cidade } from '../models/cidade';

@Injectable({
  providedIn: 'root'
})
export class MyshopFormService {

  private paisesUrl = `${API_CONFIG.baseUrl}/api/paises`;
  private estadosUrl = `${API_CONFIG.baseUrl}/api/estados`;
  private cidadesUrl = `${API_CONFIG.baseUrl}/api/cidades`;

  constructor(private httpClient: HttpClient) { }

  getPaises(): Observable<Pais[]> {
    return this.httpClient.get<GetResponsePaises>(this.paisesUrl).pipe(
      map(response => response._embedded.paises)
    )
  }

  getEstados(paisSigla: string): Observable<Estado[]> {
    const searchEstadosUrl = `${this.estadosUrl}/search/findByPaisSigla?sigla=${paisSigla}`
    return this.httpClient.get<GetResponseEstados>(searchEstadosUrl).pipe(
      map(response => response._embedded.estados)
    )
  }

  getCidades(estadoUf: string): Observable<Cidade[]> {
    const searchCidadesUrl = `${this.cidadesUrl}/search/findByEstadoUf?uf=${estadoUf}`
    return this.httpClient.get<GetResponseCidades>(searchCidadesUrl).pipe(
      map(response => response._embedded.cidades)
    )
  }

  getCrediCardMonths(startMonth: number): Observable<number[]> {

    let data: number[] = [];

    // criar um array para listar os meses
    // iniciar um loop até o mês 12


    for(let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
    // utilizamos um observable, pois posteriormente haverá um subscribe para obter os dados assincronos
  }

  getCrediCardYears(): Observable<number[]> {

    let data: number[] = [];

    // criar um array para listar os anos
    // iniciar um loop até os próximos 10 anos
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
    // utilizamos um observable, pois posteriormente haverá um subscribe para obter os dados assincronos
  }

}

interface GetResponsePaises {
  _embedded: {
    paises: Pais[];
  }
}

interface GetResponseEstados {
  _embedded: {
    estados: Estado[];
  }
}

interface GetResponseCidades {
  _embedded: {
    cidades: Cidade[];
  }
}
