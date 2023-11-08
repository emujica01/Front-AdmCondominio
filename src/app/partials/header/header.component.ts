import { Component, AfterViewInit } from '@angular/core';
import { ruta_img } from 'src/app/tools/img_rut';
import { TokenStorageService } from '../../services/login/token-storage.service';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  user:any = {};
  ImagePath = ruta_img;
  logout: any;
    //JSON de prueba
    json_test: any = {
      deviceInfo: {
        deviceId: '12345-67890',
        deviceType: 'BROWSER-CHROME',
      },
      token: this.tokenStorage.getToken(),
    };

  constructor(
    private UserService: UserService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {

    var user:any = sessionStorage.getItem("auth_session");
    user = JSON.parse(user);

    this.user = user;
  }
  logout_1(): void {
    this.UserService.Logout(this.json_test).subscribe({
      next: (data) => {
        this.logout = data;

      },
      error: (err) => {
        // En caso de error mostrar el error
        this.logout = JSON.parse(err.error).message;

      },
    });
    this.tokenStorage.signOut();
    this.router.navigate(['']);
  }
}
