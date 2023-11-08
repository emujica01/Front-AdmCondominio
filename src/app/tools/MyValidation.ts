import { AbstractControl, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
export class Myvalidations {
  today: Date = new Date();
  pipe = new DatePipe('en-US');
  todayWithPipe: any;
  // Validacion del formulario que no se repitan puntos
  static Login(control: AbstractControl) {
    //Campo del Formulario
    const value = control.value;
    let acumulador = 0;
    var busqueda = '.';

    for (let i = 0; i < value.length; i++) {
      for (let j = 0; j < value[i].length; j++) {
        if (value[i][j] === busqueda) {
          acumulador++;
        }
      }
    }

    if (acumulador > 1) {
      return { message: 'Error debe contener solo 1 punto' };
    }
    return null;
  }

  // Validaciones adicionales para coordenadas
  static coordenadas(coordenada: AbstractControl) {
    let coord = coordenada.value.split(',');
    const latitud: any = coord[0];
    const longitud: any = coord[1];
    var acumulador: any;
    var busqueda = '.';

    for (let i = 0; i < coordenada.value.length; i++) {
      for (let j = 0; j < coordenada.value[i].length; j++) {
        if (coordenada.value[i][j] === busqueda) {
          acumulador++;
        }
      }
    }

    if (acumulador > 2) {
      return { message: 'Error debe contener solo 2 puntos' };
    }

    if (latitud >= -90 && latitud <= 90) {
      if (longitud >= -180 && longitud <= 180) {
        return null;
      } else {
        return { message: 'Debe ingresar una longitud valida en coordenadas' };
      }
    } else {
      return { message: 'Debe ingresar una latitud valida en coordenadas' };
    }
  }

  // ------------------------------------------------
  // Validacion la fecha de Emision
  static validarFecha(Fecha: AbstractControl) {
    // Fecha Actual

    // Funcion para Comparar dia/mes/Fecha
    const comparar_fecha =   function compare_dates(fecha: string, fecha2: string)  
    {  
      var xMonth=fecha.substring(3, 5);  
      var xDay=fecha.substring(0, 2);  
      var xYear=fecha.substring(6,10);  
      var yMonth=fecha2.substring(3, 5);  
      var yDay=fecha2.substring(0, 2);  
      var yYear=fecha2.substring(6,10);  

      var año_actual = parseInt(yYear) - 1

      if (xYear> yYear )  
      {  
          return(true)  
      }  
      else  
      {  
        if (xYear == yYear)  
        {   
          if (xMonth> yMonth)  
          {  
              return(true)  
          }  
          else  
          {   
            if (xMonth == yMonth)  
            {  
              if (xDay>= yDay)  
                return(true);  
              else  
                return(false);  
            }  
            else  
              return(false);  
          }  
        }  
        else  
          return(false);  
      }  
  }  

    let today = new Date();
    var datePipe = new DatePipe('en-US');

    // Formateo Pipe
    let fechaFormateada = datePipe.transform(Fecha.value,'dd-MM-yyyy')!;
    let formatTodaywithpipe = datePipe.transform(today,'dd-MM-yyyy')!;

    // Verificar año actual
    var xYear=fechaFormateada.substring(6,10);
    var yYear=formatTodaywithpipe.substring(6,10);
    
    
    // Verificar Fecha
    // Si la fecha ingresada es mayor a la actual o igual, es correcto
    if(xYear != yYear){
      return { message: 'Debe Ingresar un Año Valido' };
    }

    // Verificar dia y mes correcto
    if (comparar_fecha(fechaFormateada,formatTodaywithpipe)) {
      return null;

    }else {
      return { message: 'Debe Ingresar una Fecha Valida' };
    }
  }

  static ConfirmedValidator(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];
      if (
        matchingControl.errors &&
        !matchingControl.errors['confirmedValidator']
      ) {
        return;
      }
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ confirmedValidator: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }
}
