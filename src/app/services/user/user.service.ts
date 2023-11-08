import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../API';

//Ruta para el API
const ip_api = Api.ruta;
const API_URL = ip_api + '/users/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  // Obtener todos los Datos del Usuario
  getPublicContent(): Observable<any> {
    return this.http.get(API_URL + 'meClientes', { responseType: 'json' });
  }

  //Cerrar Sesions con el Endpoint
  Logout(json: any): Observable<any> {
    return this.http.put(API_URL + 'logout', {
      deviceInfo: json.deviceInfo,
      token: json.token,
    });
  }
}
