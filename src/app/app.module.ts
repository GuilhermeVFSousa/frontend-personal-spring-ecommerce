import { NgModule, DEFAULT_CURRENCY_CODE, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProdutoListComponent } from './components/produto-list/produto-list.component';
import { HttpClientModule } from '@angular/common/http';
import { ProdutoService } from './services/produto.service';

import ptBr from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common'

registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    ProdutoListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ProdutoService, {provide: LOCALE_ID, useValue: 'pt'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
