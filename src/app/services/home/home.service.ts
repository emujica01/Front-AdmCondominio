
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Api } from '../API';

//Ruta para el API
const ip_api = Api.ruta;
const API_URL = ip_api + '/dedicado/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient) {}
  //----------------------------Consulta Facturas---------------------------------------//
  getConsultaOrdenes(json: any): Observable<any> {
    return this.http.post(
      API_URL + 'Obtenerfacturadedicado',
      {
        token: json.token,
        documentoCliente: json.documento
      },
      httpOptions
    );
  }
  //----------------------------Consulta Base64 Factura---------------------------------//
  getDocumento(json: any,factura:any): Observable<any> {
    return this.http.post(
      API_URL + 'ObtenerfacturaDocument',
      {
        token: json.token,
        facturasDocument: factura
      },
      httpOptions
    );
  }
  //----------------------------Consulta Servicios Activos------------------------------//
  getServicios(json: any): Observable<any> {
    return this.http.post(
      API_URL + 'ServiciosActivos',
      {
        token: json.token,
        documentoCliente: json.documento
      },
      httpOptions
    );
  }
  //----------------------------Consulta Grafico de trafico-----------------------------//
  getTrafico(codGrafico:any,tipo:any): Observable<any> {
    return this.http.post(
      API_URL + 'GraficoDedicado',
      {
        codigoGrafico: codGrafico,
        tipoGrafico: tipo
      },
      httpOptions
    );
  }

}






