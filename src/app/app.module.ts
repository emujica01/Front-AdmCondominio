import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AuthInterceptor } from './tools/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/home/home.component';
import { LoginComponent } from './login/login.component';
import { PagosComponent } from './modules/pagos/pagos.component';
import { MenuComponent } from './partials/menu/menu.component';
import { HeaderComponent } from './partials/header/header.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
// import { MaterialIcon } from 'material-icons';
import {
  FontAwesomeModule,
  FaIconLibrary,
} from '@fortawesome/angular-fontawesome';
import {
  faHammer,
  faSquareMinus,
  faUserTie,
  faEye,
  faPencil,
  faUserMinus,
  faRepeat,
  faBan,
  faRotateRight,
  faMagnifyingGlass,
  faCircleXmark,
  faCheck,
  faEnvelope,
  faLock,
  faUser,
  faEyeSlash,
  faKey,
  faImage,
  faUsersGear,
  faCalendar,
  faNoteSticky
} from '@fortawesome/free-solid-svg-icons';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { TraficoComponent } from './modules/home/components/trafico/trafico.component';
import { SolicitudesComponent } from './modules/home/components/solicitudes/solicitudes.component';
import { FacturasComponent } from './modules/home/components/facturas/facturas.component';
import { ServiciosActivosComponent } from './modules/home/components/servicios-activos/servicios-activos.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { ReportesComponent } from './modules/reportes/reportes.component';
import { NgbModule,NgbPopover,NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoadingInterceptor } from './tools/loading.interceptor';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    PagosComponent,
    MenuComponent,
    HeaderComponent,
    HomeLayoutComponent,
    TraficoComponent,
    SolicitudesComponent,
    FacturasComponent,
    ServiciosActivosComponent,
    SpinnerComponent,
    ReportesComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    NgbPopover,
    NgbPopoverModule,

    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      maxOpened: 3,
      progressBar: true,
      titleClass: '',
      messageClass: 'Cuerpo',
    }),
    BrowserAnimationsModule,
    NgbModule,
    NgxSpinnerModule
  ],
    providers: [
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(
      faHammer,
      faSquareMinus,
      faUserTie,
      faEye,
      faPencil,
      faUserMinus,
      faRepeat,
      faBan,
      faRotateRight,
      faMagnifyingGlass,
      faCircleXmark,
      faCheck,
      faEnvelope,
      faLock,
      faUser,
      faEyeSlash,
      faKey,
      faImage,
      faUsersGear,
      faCalendar,
      faNoteSticky
    );
  }
}
