import { API_CONFIG } from './../config/api.config';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { from, lastValueFrom, Observable } from 'rxjs';
import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_AUTH } from '@okta/okta-angular';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(@Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.hadleAccess(req, next));
  }

  private async hadleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {

    // Passar o token somente para os endpoints com secutiry no back-end
    const securedEndpoints = [`${API_CONFIG}/api/orders`];

    // verificar se o URL navegado é igual ao securedEndpoint
    if(securedEndpoints.some(url => req.urlWithParams.includes(url))) {

      //obter o token de acesso
      const accessToken = this.oktaAuth.getAccessToken();

      // clonar a requisição e add o novo header contendo o token de acesso
      req = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }
    return await lastValueFrom(next.handle(req));
  }
}
