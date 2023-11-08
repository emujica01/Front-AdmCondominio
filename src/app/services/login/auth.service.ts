import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../API';

const ip_api = Api.ruta;
const AUTH_API = ip_api + '/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  //Iniciar Sesion
  login(user: {
    username: any;
    password: any;
    deviceInfo: any;
    id_interface: any;
  }): Observable<any> {
    return this.http.post(
      AUTH_API + 'signin',
      {
        username: user.username,
        password: user.password,
        deviceInfo: user.deviceInfo,
        id_interface: user.id_interface,
      },
      httpOptions
    );
  }

 
  // Actualizar Token
  RefreshToken(refreshToken: any): Observable<any> {
    return this.http.post(AUTH_API + 'refresh', {
      refreshToken: refreshToken,
    });
  }
}
