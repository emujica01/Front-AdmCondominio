import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { TokenStorageService } from '../login/token-storage.service';
import { Api,userPh } from '../API';
@Injectable({
  providedIn: 'root'
})
export class ConexionPhService {
  json: any;
  httpOptions: any;
  constructor(
    private http: HttpClient,
    private TokenStorage: TokenStorageService
  ) { }

    // Guardar Token en session
    GenerarToken(): Promise<void> {
      // Llamar al Servicio y Guardar el Token
      return new Promise((resolve, reject)=> {

        this.conexionPh().subscribe({
          next: (data) => {
            this.TokenStorage.SaveTokenPH(data);
            resolve(); //*Se resuelve la promesa
          },
          error: (err) => {
            reject(err);
          }
        });
      })
    }

    // Test Conexion
    conexionPh(): Observable<any> {
      return this.http.post(
        'https://testing.airtek.com.ve:9595/Token',
        {
          UserName: userPh.UserName,
          Password: userPh.Password,
          TipoConsulta: userPh.TipoConsulta,
        },
        { responseType: 'text' }
      );
    }
}
