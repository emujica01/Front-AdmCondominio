import { Component, AfterViewInit, Renderer2, ViewChild,ElementRef } from '@angular/core';
import { Router } from '@angular/router';

import { ruta_img } from '../tools/img_rut';
import { Myvalidations } from '../tools/MyValidation';
import { AuthService } from '../services/login/auth.service';
import { TokenStorageService } from '../services/login/token-storage.service';
import { LoadscService } from '../tools/loadsc.service';

//Modulo de Formularios
import {
  FormBuilder,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements AfterViewInit {

    ImagePath = ruta_img;
    tipo: any = 'password';
    form: any = {};
    isLoggedIn = false;
    isLoginFailed = false;
    errorMessage = '';
    errorTitle = '';
    roles: string[] = [];
    constructor(    private authService: AuthService,
      private tokenStorage: TokenStorageService,
      private router: Router,
      private toastr: ToastrService,
      private fb: FormBuilder,
      private renderer: Renderer2,
      private scriptService: LoadscService,
      private spinner: NgxSpinnerService
      ){

    }


    ngAfterViewInit():void{

      this.spinner.show('primary');

      this.isLoggedIn = !!this.tokenStorage.getToken();
      // console.log(this.isLoggedIn);
      if (this.tokenStorage.getToken()) {
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.router.navigate(['home']);
      }

      setTimeout(() => {
        this.spinner.hide('primary');
      }, 1000);
    }

    LoginForm = this.fb.group(
      {
        username: [
          '',
          [
            Validators.required,
            Myvalidations.Login,
            Validators.pattern(/^[a-zA-Z]+[.]{1}[a-zA-Z]+$/),
          ],
        ],
        password: [
          '',
          {
            validators: [Validators.required, Validators.minLength(6)],
            updateOn: 'change',
          },
        ],

      },
      { updateOn: 'blur' }
    );

      //Iniciar Sesion
  onSubmit(): void {
    // this.spinner.show();
    this.isLoginFailed = false;
    // Si el Formulario es valido inicia sesion
    if (this.LoginForm.valid) {
      //Json a Enviar para el Login
      this.form = {
        username: this.LoginForm.get('username')?.value,
        password: this.LoginForm.get('password')?.value,
        deviceInfo: {
          deviceId: '12345-67890',
          deviceType: this.getBrowserName(),
        },
        id_interface: 7,
      };


      this.authService.login(this.form).subscribe({
        next: (data) => {
          this.tokenStorage.saveToken(data.accessToken);
          this.tokenStorage.Session(JSON.stringify(data));
          this.tokenStorage.ExpiryTimout(true);
          this.toastr.success('Bienvenido al Portal de Adiminstración de Condominios', 'Validación exitosa');
          setTimeout(() => {
            /** spinner ends after 5 seconds */
            // this.spinner.hide();
            window.location.href = 'home';
          }, 2000);
        },
        error: (err) => {
          this.errorTitle = err.error.descripcion;
          this.errorMessage = err.error.detalle;
          this.isLoginFailed = true;
          //Notificaciones del Login
          this.toastr.error(err.error.detalle, this.errorTitle);
          // this.spinner.hide();
        },
      });
    }
  }
    //Obtener navegador
    getBrowserName() {
      const agent = window.navigator.userAgent.toLowerCase();
      switch (true) {
        case agent.indexOf('edge') > -1:
          return 'BROWSE-EDFE';
        case agent.indexOf('opr') > -1 && !!(<any>window).opr:
          return 'BROWSE-OPERA';
        case agent.indexOf('chrome') > -1 && !!(<any>window).chrome:
          return 'BROWSE-CHROME';
        case agent.indexOf('trident') > -1:
          return 'BROWSE-TRINDENT';
        case agent.indexOf('firefox') > -1:
          return 'BROWSE-FIREFOX';
        case agent.indexOf('safari') > -1:
          return 'BROWSE-SAFARI';
        default:
          return 'OTHER';
      }
    }

    //Funcion que muestra y oculta la contraseña
    mostrarContrasena() {
      const eye: any = document.getElementById('eye');
      const eyeSlash: any = document.getElementById('eyeSlash');
      console.warn(this.tipo);
      if (this.tipo == 'password') {
        this.tipo = 'text';
        eye.classList.add('d-none');
        eyeSlash.classList.remove('d-none');
      } else {
        this.tipo = 'password';
        eye.classList.remove('d-none');
        eyeSlash.classList.add('d-none');
      }
    }
}
