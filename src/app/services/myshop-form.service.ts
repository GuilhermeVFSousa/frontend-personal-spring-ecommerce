import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyshopFormService {

  constructor() { }

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
