import {
  Component,
  Renderer2,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Options } from '@popperjs/core';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';

import { ruta_img } from '../../tools/img_rut';
import { ReporteService } from 'src/app/services/report/reporte.service';
//Modulo de Formularios
declare var window: any;

@Component({
  selector: 'app-pagos',
  templateUrl: './pagos.component.html',
  styleUrls: ['./pagos.component.css']
})
export class PagosComponent {

  ImagePath = ruta_img;
  modaldatos: any;
  fechaVencimiento: any;
  token: any;
  json: any;
  user: any;
  valorDeuda: any;
  valorDeudaBs:any;
  valorDeudaDolar:any;


  constructor(
    private NgbPopoverModule: NgbPopoverModule,
    private ReporteService: ReporteService,
    protected fb: FormBuilder,
    private toastr: ToastrService,
    private render: Renderer2,
    private spinner: NgxSpinnerService
  ) {}


  ngAfterViewInit(): void {
    this.spinner.show('primary');
    this.fecha();

    this.token = sessionStorage.getItem('auth-ph');
    this.user = sessionStorage.getItem('auth_session');
    this.user = JSON.parse(this.user);
    this.json = { token: this.token, documento: this.user.documento };

    this.deuda();

    setTimeout(() => {
      this.spinner.hide('primary');
    }, 1500);
  }
  deuda() {
    this.ReporteService.getDeuda(this.json).subscribe({
      next: (data) => {
        this.valorDeuda = data;
        this.valorDeuda = Math.abs(parseFloat(this.valorDeuda.DeudaDedicado));
        const formatter = new Intl.NumberFormat('es-VE', {
          style: 'currency',
          currency: 'USD'
        });

        this.valorDeudaDolar = formatter.format(this.valorDeuda).replace('USD', '');
        this.deudaBolivares();
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          // this.spinner.hide();
        }, 1000);
      },
      error: (err) => {
        console.log(JSON.parse(err.error).message);
      },
    });
  }

  deudaBolivares(){

    this.ReporteService.getTasa().subscribe({
      next: (data) => {
        let valor = data;
        let deudaBs:any= parseFloat(this.valorDeuda) * valor.Monto;
        this.valorDeudaBs =deudaBs.toFixed(2);
        const formatter = new Intl.NumberFormat('es-VE', {
          style: 'currency',
          currency: 'VEF'
        });

        this.valorDeudaBs = formatter.format(this.valorDeudaBs).replace('VEF', '');

        setTimeout(() => {
          /** spinner ends after 5 seconds */
          // this.spinner.hide();
        }, 1000);
      },
      error: (err) => {
        console.log(JSON.parse(err.error).message);
      },
    });

  }

fecha() {
  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  this.fechaVencimiento = new Date(year, date.getMonth(), 5).toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' });
}

}
