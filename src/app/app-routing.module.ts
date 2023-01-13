import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdutoListComponent } from './components/produto-list/produto-list.component';

const routes: Routes = [
  {path: 'categoria/:id', component: ProdutoListComponent},
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
