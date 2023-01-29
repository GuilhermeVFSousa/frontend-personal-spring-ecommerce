import { Component, Inject, OnInit } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  userFullName: string = '';

  storage: Storage = localStorage;

  constructor(
    private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth
    ) { }

  ngOnInit(): void {
    // subscribe no estato da autenticação
    this.oktaAuthService.authState$.subscribe(
      result => {
        this.isAuthenticated = result.isAuthenticated;
        this.getUserDetails();

      }
    );
  }

  getUserDetails() {

    // buscar os detalhes do usuario logado (user is claims)
    // user full name é exposto como um property name
    this.oktaAuth.getUser().then(
      (res) => {
        this.userFullName = res.name as string;

        // receber o email do usuario autenticado no response
        const theEmail = res.email;

        // armazenar o e-mail em localStorage
        this.storage.setItem('userEmail', JSON.stringify(theEmail));

      }
    )
  }

  logout() {
    // Finalizar a sessão com o Okta e remover os tokens atuais
    this.oktaAuth.signOut();
  }

}
