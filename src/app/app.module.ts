import { NgModule, DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProdutoListComponent } from './components/produto-list/produto-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProdutoService } from './services/produto.service';

import ptBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { ProdutoCategoriaMenuComponent } from './components/produto-categoria-menu/produto-categoria-menu.component';
import { SearchComponent } from './components/search/search.component';
import { ProdutoDetailsComponent } from './components/produto-details/produto-details.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CartStatusComponent } from './components/cart-status/cart-status.component';

registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    ProdutoListComponent,
    ProdutoCategoriaMenuComponent,
    SearchComponent,
    ProdutoDetailsComponent,
    CartStatusComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    NgbModule
  ],
  providers: [ProdutoService, {provide: LOCALE_ID, useValue: 'pt'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
