import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './modules/home/home.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { PagosComponent } from './modules/pagos/pagos.component';
import { CanActivateAuthGuard } from './services/guard/auth-guard.service';
import { ReportesComponent } from './modules/reportes/reportes.component';

const routes: Routes = [

  {
    path: '',
    component: LoginComponent,
  },
  {
    path: '',
    canActivate: [CanActivateAuthGuard],
    component: HomeLayoutComponent,
    children: [
      {
      path: 'home',
      component: HomeComponent
      },
      //Rutas
      {
        path: 'reportesPagos',
        component: ReportesComponent
      },
      {
        path: 'PagosEnLinea',
        component: PagosComponent
      }
    ]
  },
  { path: '**', redirectTo: '/home' },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


