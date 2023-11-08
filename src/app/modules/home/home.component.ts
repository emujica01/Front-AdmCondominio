import { Component, Inject, Input, AfterViewInit } from '@angular/core';
import { Token } from '@angular/compiler';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';

import { TokenStorageService } from '../../services/login/token-storage.service';
import { UserService } from '../../services/user/user.service';
import { ConexionPhService } from '../../services/conexion-ph/conexion-ph.service';
import { ruta_img } from '../../tools/img_rut';

export interface JsonInterface{
  token:string,
  documento:string|null
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  ImagePath = ruta_img;
  content: any = {};
  currentUser: any;
  json:any={
    token:'',
    documento:''
  };

  constructor(
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private dialog: MatDialog,
    private ConexionService:ConexionPhService,
  ) {}


  async ngAfterViewInit() {

    await this.GenerarTokenPh();

    var token = sessionStorage.getItem("auth-ph");
    var user:any = sessionStorage.getItem("auth_session");
    user = JSON.parse(user);
    this.json = {
      token: token,
      documento: user.documento
    };

    this.currentUser = this.tokenStorage.getUser();

    //Carga Imagenes
    this.ImagePath;
  }
    //* Llamado http asincrono para esperar que este listo.
    async GenerarTokenPh(): Promise<void> {
    // Si el token ya existe no se genera
    if (!sessionStorage.getItem('auth-ph')) {
      // Parametros del JSON
      await this.ConexionService.GenerarToken();
    }
  }
}
