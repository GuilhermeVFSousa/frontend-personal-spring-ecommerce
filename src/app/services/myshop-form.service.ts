import { API_CONFIG } from './../config/api.config';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MyshopFormService {

  private coutriesUrl = `${API_CONFIG.baseUrl}/api/paises`;
  private statesUrl = `${API_CONFIG.baseUrl}/api/estados`;
  private citiesUrl = `${API_CONFIG.baseUrl}/api/cidades`;

  constructor(private httpClient: HttpClient) { }

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
