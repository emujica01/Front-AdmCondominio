import { Component, Input } from '@angular/core';
import { HomeService } from 'src/app/services/home/home.service';
import { UserService } from 'src/app/services/user/user.service';
import { JsonInterface } from '../../home.component';

declare var window: any;
@Component({
  selector: 'app-servicios-activos',
  templateUrl: './servicios-activos.component.html',
  styleUrls: ['./servicios-activos.component.css']
})
export class ServiciosActivosComponent {
  //propiedades
  modalServicio:any;
  user:any;
  token:any;
  json:any;
  servicios:any[]=[];
  serviciosInternet:any[]=[];
  serviciosTransporte:any[]=[];
  servicioDetalle:any[]=[];
  tituloDetalle:any;

  @Input() solicitud:JsonInterface= {
    token:'',
    documento:''
  }; 

  constructor(private HomeService: HomeService,
              private UserService: UserService){}

  ngAfterViewInit(): void{

    this.CargarServicios();

  }

  CargarServicios(){
    this.HomeService.getServicios(this.solicitud).subscribe({
      next: (data) => {
        this.servicios = data;
        this.ArreglarData();
      },
      error: (err) => {
        console.log(JSON.parse(err.error).message)
      },
    });

  }

  ArreglarData(){

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

  }


  openServicioDetalle(tipo:any){

    this.servicioDetalle=[];
    this.tituloDetalle='';
    if(tipo==1){
      this.tituloDetalle = 'Internet';
      this.servicioDetalle = this.serviciosInternet;
    }else{
      
      this.tituloDetalle = 'Transporte';
      this.servicioDetalle = this.serviciosTransporte;
    }

    this.modalServicio = new window.bootstrap.Modal(
      document.getElementById('servicios')
    );

    this.modalServicio.show()
  }
}
