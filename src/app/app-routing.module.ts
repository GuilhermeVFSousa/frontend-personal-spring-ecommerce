import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdutoListComponent } from './components/produto-list/produto-list.component';
import { ProdutoDetailsComponent } from './components/produto-details/produto-details.component';
import { CartDetailsComponent } from './components/cart-details/cart-details.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OktaCallbackComponent } from '@okta/okta-angular';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},
  {path: 'checkout', component: CheckoutComponent},
  {path: 'cart-details', component: CartDetailsComponent},
  {path: 'produtos/:id', component: ProdutoDetailsComponent},
  {path: 'search/:keyword', component: ProdutoListComponent},
  {path: 'categoria/:id/:nome', component: ProdutoListComponent},
  {path: 'categoria', component: ProdutoListComponent},
  {path: 'produtos', component: ProdutoListComponent},
  {path: '', redirectTo: '/produtos', pathMatch: 'full'},
  {path: '**', redirectTo: '/produtos', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
