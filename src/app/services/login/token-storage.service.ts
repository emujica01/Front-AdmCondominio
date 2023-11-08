import { Injectable } from '@angular/core';
import { LoadscService } from '../../tools/loadsc.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';
const USER_NOMBRE = 'nombre';
const session = 'session';

// Variable para el Expirar Token
const timeout = 'timeout';

// Variable donde se Guarda el Rol
const authrol = 'auth_session';
// Token Para Prohan
const TOKEN_PH = 'auth-ph';

@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  constructor(private script: LoadscService) {}

  //Destruir la session

  signOut(): void {
    window.sessionStorage.clear();
  }

  //Salvar el token
  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string {
    return sessionStorage.getItem(TOKEN_KEY)!;
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);

    // Ingresa datos del usuario - a la Session Storage
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
    window.sessionStorage.setItem(USER_NOMBRE, JSON.stringify(user));
  }

  public getUser(): any {
    return JSON.parse(sessionStorage.getItem(USER_KEY)!);
  }

  //Funciones para Expirar la session
  public Session(response: any): void {
    window.sessionStorage.removeItem(session);
    window.sessionStorage.setItem(session, response);
  }

  //Funciones para Expirar la session
  public ExpiryTimout(response: any): any {
    window.sessionStorage.removeItem(timeout);
    window.sessionStorage.setItem(timeout, response);
  }

  public GetExpiryTimout(): any {
    return JSON.parse(sessionStorage.getItem(timeout)!);
  }

  public GetSession(): void {
    return JSON.parse(sessionStorage.getItem(session)!);
  }

  //Salvar el token de proham
  public SaveTokenPH(tokenph: any): void {
    window.sessionStorage.removeItem(TOKEN_PH);
    window.sessionStorage.setItem(TOKEN_PH, tokenph);
  }

  // Funcion Obtener Token
  public getTokenPH(): any {
    return sessionStorage.getItem(TOKEN_PH)!;
  }

  // -----------------------------------------------------
  //Salvar ME
  public SaveMe(session_rol: any): void {
    window.sessionStorage.removeItem(authrol);
    window.sessionStorage.setItem(authrol, session_rol);
  }

  // obtener Me de session
  public GetMe(): any {
    return JSON.parse(sessionStorage.getItem(authrol)!);
  }
}
