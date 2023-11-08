//Servicio para Redirrecionar si no esta Logueado
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root',
})
export class CanActivateAuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    let currentUser = sessionStorage.getItem(TOKEN_KEY);
    if (currentUser) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }
}
