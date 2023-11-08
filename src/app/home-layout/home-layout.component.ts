import { Component } from '@angular/core';
import { TokenStorageService } from '../services/login/token-storage.service';
import { ruta_img } from '../tools/img_rut';
import { Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { ConfirmBoxEvokeService } from '@costlydeveloper/ngx-awesome-popup';
import { AuthService } from '../services/login/auth.service';
@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css']
})
export class HomeLayoutComponent {
  ImagePath = ruta_img;
  session: any;
  salir: any;
  VarExpiry: number = 0;
  promise: boolean = false;
  constructor(
    private UserService: UserService,
    private tokenStorage: TokenStorageService,
    private userService: UserService,
    private router: Router,
    private authService: AuthService,
    private confirmBoxEvokeService: ConfirmBoxEvokeService
  ) {}

  content: any;

  //JSON de prueba
  json_test: any = {
    deviceInfo: {
      deviceId: '12345-67890',
      deviceType: 'BROWSER-CHROME',
    },
    token: this.tokenStorage.getToken(),
  };


  //Inicio del componente
  async ngOnInit(): Promise<void> {
    this.ImagePath;

    await this.CallME();


    this.session = this.tokenStorage.GetSession();

    let condicion: boolean = this.tokenStorage.GetExpiryTimout();
    // Si entra por primera Vez Ejecuta
    if (condicion === true) {
      this.VarExpiry = parseInt(this.session.expiryDuration) - 10000;

      this.ExpirarToken(this.VarExpiry);
      this.tokenStorage.ExpiryTimout(false);
    }

    // Si recarga la pagina Refresca el Token y vuelve a ejecutar la funcion
    if (condicion === false) {
      this.authService.RefreshToken(this.session.refreshToken).subscribe({
        next: (response) => {
          //
          //Si no responde el mensaje espera 10 segundo para salir
          // Si no responde Cerrar la session

          this.tokenStorage.saveToken(response.accessToken);
          this.tokenStorage.Session(JSON.stringify(response));
        },
        error: (err) => {
          // En caso de error mostrar el error
          this.content = JSON.parse(err.error).message;
        },
      });

      this.session = this.tokenStorage.GetSession();
      this.VarExpiry = parseInt(this.session.expiryDuration) - 15000;

      this.ExpirarToken(this.VarExpiry);
    }
  }

  async CallME(): Promise<void>{
    return new Promise((resolve, reject) => {

      this.userService.getPublicContent().subscribe({
      next: (data) => {
        this.content = data;
        this.tokenStorage.SaveMe(JSON.stringify(this.content));
        this.promise = true;
        resolve();
        //
        //si no hay error carga los datos
        // this.toastr.success("Bienvenido! a SIGO")
      },
      error: (err) => {
        // En caso de error mostrar el error
        this.content = JSON.parse(err.error).message;
        reject(err);
      },
    });
    })
  }




  ExpirarToken(tiempo: number): void {
    //
    //  Expiracion de Token
    setTimeout(() => {
      // Si no responde el Mensaje Sacar de la session
      let timeoutId: any = setTimeout(() => {
        // alert('Cerrar la sesion'),
        this.logout_1();
      }, 14000);

      /** spinner ends after 5 seconds */
      this.confirmBoxEvokeService
        .info(
          'Sesion Expirada!',
          'Desea salir de la Sesion?',
          'Continuar',
          'Salir'
        )
        .subscribe((resp) => {
          this.salir = resp.success;

          if (this.salir == false) {
            this.logout_1();
            return;
          }
          if (this.salir == true) {
            this.authService.RefreshToken(this.session.refreshToken).subscribe({
              next: (response) => {
                //Si no responde el mensaje espera 10 segundo para salir
                // Si no responde Cerrar la session

                //

                this.tokenStorage.saveToken(response.accessToken);
                this.tokenStorage.Session(JSON.stringify(response));
                // Cancelar Timeout previo al combo box
                clearTimeout(timeoutId);

                // Volver a activar la funcion
                return this.ExpirarToken(this.VarExpiry);
              },
              error: (err) => {
                // En caso de error mostrar el error
                this.content = JSON.parse(err.error).message;
              },
            });
          }
        });
    }, tiempo);
  }

  //Funcio Logout
  logout_1(): void {
    this.UserService.Logout(this.json_test).subscribe(
      (data) => {
        this.content = data;

      },
      (err) => {
        // En caso de error mostrar el error
        this.content = JSON.parse(err.error).message;

      }
    );
    this.tokenStorage.signOut();

    this.router.navigate([''])

  }
}
