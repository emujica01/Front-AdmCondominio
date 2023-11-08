import { Component } from '@angular/core';

declare var window: any;

@Component({
  selector: 'app-solicitudes',
  templateUrl: './solicitudes.component.html',
  styleUrls: ['./solicitudes.component.css']
})
export class SolicitudesComponent {

  //propiedades
  modalSolicitudes:any;

  ngAfterViewInit(): void{



  }

  openSolicitudesDetalle(idSolicitud:any){
    
    this.modalSolicitudes = new window.bootstrap.Modal(
      document.getElementById('solicitudes')
    );

    this.modalSolicitudes.show()
  }

}
