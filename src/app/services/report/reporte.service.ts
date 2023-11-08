import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api,Masivo } from '../API';

//Ruta para el API
const ip_api = Api.ruta;
const API_URL = ip_api + '/dedicado/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class ReporteService {

  constructor(private http: HttpClient) {}
    //----------------------------Consulta Facturas---------------------------------------//
    getDeuda(json: any): Observable<any> {
      return this.http.post(
        API_URL + 'DeudaDedicado',
        {
          token: json.token,
          documentoCliente: json.documento
        },
        httpOptions
      );
    }
  
    //----------------------------Reporte Facturas---------------------------------------//
      postReporte(json: any): Observable<any> {
      return this.http.post(
        API_URL + 'ReportaPago',
        {
          documentoCliente: json.documento,
          referencia: json.referencia,
          telefono: json.telefono,
          tipo: json.tipo
        },
        httpOptions
      );
    }

    //----------------------------Reporte Facturas---------------------------------------//
    getTasa(): Observable<any> {
      return this.http.get(
        Masivo.ruta,
        httpOptions
      );
    }
}
