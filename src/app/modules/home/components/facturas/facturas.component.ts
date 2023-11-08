import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ruta_img } from '../../../../tools/img_rut';
import { HomeService } from 'src/app/services/home/home.service';
import { UserService } from 'src/app/services/user/user.service'
import { JsonInterface } from '../../home.component';


@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})

export class FacturasComponent {
  ImagePath = ruta_img;
  contenido:any;
  user:any;
  contador:any;
  base64:any;
  facturas:any[]=[];
  documento:any;
  token:any;
  json:any={
    token:'',
    documento:''
  };

  @Input() solicitud:JsonInterface= {
    token:'',
    documento:''
  };

  constructor( private homeService:HomeService,
               private UserService:UserService,
               private toastr: ToastrService,){

  }

  ngOnInit(): void {
    // console.log(this.solicitud);
    this.CargaFactura();

  }


  CargaFactura():void{


    this.homeService.getConsultaOrdenes(this.solicitud).subscribe({
      next: (data) => {
        this.contenido = data;
        this.contenido.sort((a:any, b:any) => new Date(b.FechaEmision).getTime() - new Date(a.FechaEmision).getTime());
        // console.log(this.contenido);
        this.data();
        setTimeout(() => {
          /** spinner ends after 5 seconds */
          // this.spinner.hide();
        }, 1000);

      },
      error: (err) => {
        console.error(JSON.parse(err.error).message);
      },
    });
  }

  data(){
    var contador:number=1;
    var obj:any={
      factura:'',
      fecha:'',
      monto:0.00
    }
    this.contenido.forEach((element:any) => {
      obj={
        factura:'',
        fecha:'',
        monto:0.00
      }
        let fecha = element.FechaEmision.toString();
        fecha = fecha.substr(0,10);
        let monto = element.Monto.toFixed(2);

        obj={
          factura:element.NFactura,
          fecha:fecha,
          monto:monto
        }
        contador = contador +1;
        this.facturas.push(obj);
    });

    // console.log(this.facturas);
  }

  descargaPdf(num:any,fecha:any){
    var arrayFactura=[];
    arrayFactura.push(num);

    this.homeService.getDocumento(this.solicitud,arrayFactura).subscribe({
      next: (data) => {

        if(data.statusMensajes=='1'){
          this.toastr.error('Por favor, intente más tarde','Error inesperado');
        }else{

          this.base64 = data;
          // console.log(this.base64);
          this.crearPdf(fecha,this.base64);
          this.toastr.success('Factura generada exitosamente');

        }

        setTimeout(() => {
          /** spinner ends after 5 seconds */
          // this.spinner.hide();
        }, 1000);

      },
      error: (err) => {
        console.error(JSON.parse(err.error).message);
      },
    });



  }

  crearPdf(fecha:any,Base64:any){
    const source = 'data:application/pdf;base64,'+Base64;
    const link = document.createElement("a");
    link.href = source;
    link.download = 'Factura-'+fecha+'.pdf';
    link.click();
  }

  }

