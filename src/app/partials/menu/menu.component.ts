import { Component } from '@angular/core';
import { ruta_img } from 'src/app/tools/img_rut';
import { ArrayMenu } from 'src/app/tools/menu';
import { TokenStorageService } from '../../services/login/token-storage.service';
import { UserService } from '../../services/user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  ImagePath = ruta_img;
  main:any[] = ArrayMenu;
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
