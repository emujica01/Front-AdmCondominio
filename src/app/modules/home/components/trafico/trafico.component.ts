import { Component, Input } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { HomeService } from 'src/app/services/home/home.service';
import { JsonInterface } from '../../home.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-trafico',
  templateUrl: './trafico.component.html',
  styleUrls: ['./trafico.component.css']
})
export class TraficoComponent {

  user:any;
  token:any;
  json:any;
  trafico:any;
  servicios:any[]=[];
  serviciosTransporte:any[]=[];
  serviciosInternet:any[]=[];
  tipo:any='6h';
  img:any='';
  
  @Input() solicitud:JsonInterface= {
    token:'',
    documento:''
  }; 
  
  constructor(private UserService:UserService,
              private HomeService:HomeService,
              private toastr: ToastrService){}

  ngOnInit(): void {
    this.CargaTrafico();
  }

  CargaTrafico(){
    this.HomeService.getServicios(this.solicitud).subscribe({
      next: (data) => {
        this.servicios = data;
        
        var obj={
          nombre:'',
          grupoServicio:0,
          codGrafico:''
         };
    
          this.servicios.forEach((element:any) => {
    
            obj={
              nombre:'',
              grupoServicio:0,
              codGrafico:''
             }
    
             obj={
              nombre:element.planServicio,
              grupoServicio:parseInt(element.grupoServicio),
              codGrafico:element.codGrafico
             }
            if(obj.grupoServicio == 5){
              this.serviciosTransporte.push(obj);
            }else{
              this.serviciosInternet.push(obj);
            }
    
          });
    


      },
      error: (err) => {
        console.log(JSON.parse(err.error).message)
      },
    });

  }

  selectServicio(servicio:any){
    if(servicio!=''){

      var error: any = document.getElementById('error');
      var divA: any = document.getElementById('normal');
      this.HomeService.getTrafico(servicio,this.tipo).subscribe({
        next: (data) => {
          this.trafico = data;
          if(this.trafico.statusMensajes==2 || this.trafico.statusMensajes==1){
            this.img='';
            error.classList.remove('d-none');
            divA.classList.add('d-none');
            this.toastr.info('No se encontro información para mostrar');
          }
          else{
            this.img='data:image/png;base64,'+this.trafico.Base64Image;
            
            error.classList.add('d-none');
            divA.classList.remove('d-none');
            this.toastr.success('Proceso completado con exito');
          }
        },
        error: (err) => {
          console.log(JSON.parse(err.error).message);
        },
      });

    }else{
      this.toastr.error('Por favor seleccione un servicio');
    }
  }

  limpiarClass(){
    var divA: any = document.getElementById('6h');
    var divB: any = document.getElementById('24h');
    var divC: any = document.getElementById('48h');

    divA.classList.remove('filterHoras');
    divA.classList.remove('filterHorasActivo');
    divB.classList.remove('filterHoras');
    divB.classList.remove('filterHorasActivo');
    divC.classList.remove('filterHoras');
    divC.classList.remove('filterHorasActivo');
  }

  clickHr(tipo:any,servicio:any){

    var divA: any = document.getElementById('6h');
    var divB: any = document.getElementById('24h');
    var divC: any = document.getElementById('48h');

    switch (tipo) {
      case 1:
        this.tipo='6h';
        
        this.limpiarClass();
        divA.classList.add('filterHorasActivo');
        divB.classList.add('filterHoras');
        divC.classList.add('filterHoras');
        break;
      case 2:
        this.tipo='24h';

        this.limpiarClass();
        divA.classList.add('filterHoras');
        divB.classList.add('filterHorasActivo');
        divC.classList.add('filterHoras');
        break;
      case 3:
          this.tipo='48h';

          
        this.limpiarClass();
        divA.classList.add('filterHoras');
        divB.classList.add('filterHoras');
        divC.classList.add('filterHorasActivo');
        break;
    }
    if(servicio!=''){

      var error: any = document.getElementById('error');
    var divA: any = document.getElementById('normal');
    this.HomeService.getTrafico(servicio,this.tipo).subscribe({
      next: (data) => {
        this.trafico = data;
        if(this.trafico.statusMensajes==2 || this.trafico.statusMensajes==1){
          this.img='';
          error.classList.remove('d-none');
          divA.classList.add('d-none');
          this.toastr.info('No se encontro información para mostrar');
        }
        else{
          this.img='data:image/png;base64,'+this.trafico.Base64Image;
          
          error.classList.add('d-none');
          divA.classList.remove('d-none');
          this.toastr.success('Proceso completado con exito');
        }
      },
      error: (err) => {
        console.log(JSON.parse(err.error).message);
      },
    });


    }else{
      this.toastr.error('Por favor seleccione un servicio');
    }

  }



}
