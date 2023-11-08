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
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
})
export class ReportesComponent {
  @ViewChild('medio') valueMedia!: ElementRef<HTMLSelectElement>;
  @ViewChild('referencia') valueReferencia!: ElementRef<HTMLInputElement>;
  @ViewChild('pref') valuePref!: ElementRef<HTMLSelectElement>;
  @ViewChild('numero') valueNumero!: ElementRef<HTMLInputElement>;

  @ViewChild('file') file!: ElementRef<HTMLInputElement>;

  //propiedades
  ImagePath = ruta_img;
  modaldatos: any;
  fechaVencimiento: any;
  token: any;
  json: any;
  user: any;
  valorDeuda: any;
  valorDeudaBs:any;
  valorDeudaDolar:any;
  diabled: boolean = true;
  arrayReporte: any[] = [];
  obj: any = {
    id: 0,
    flujo: 0,
    medioMuestra: '',
    telefono: '',
    telefonoMuestra: '',
    referencia: '',
  };

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

    this.render.listen(this.file.nativeElement, 'change', (event) => {
      this.onFileSelected(event);
    });

    setTimeout(() => {
      this.spinner.hide('primary');
    }, 1500);
  }

  medioDePago(medio: any) {
    let numero: any = document.getElementById('number');

    this.valuePref.nativeElement.value = '';
    this.valueNumero.nativeElement.value = '';

    if (medio == 3) {
      numero.classList.remove('d-none');
      this.diabled = false;
    } else {
      numero.classList.add('d-none');
      this.diabled = true;
    }

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
  openDatos() {
    this.modaldatos = new window.bootstrap.Modal(
      document.getElementById('datos')
    );

    this.modaldatos.show();
  }

  popperOptions = (options: Partial<Options>) => {
    // customize placement
    options.placement = 'bottom';

    // customize modifiers
    for (const modifier of options.modifiers || []) {
      // disable flip
      if (modifier.name === 'flip') {
        modifier.enabled = false;
      }

      // customize offset
      if (modifier.name === 'offset' && modifier.options) {
        modifier.options['offset'] = () => [20, 20];
      }
    }

    // add your own modifier
    options.modifiers?.push({
      name: 'custom',
      enabled: true,
      phase: 'main',
      fn: ({ state }) => {
        console.log('custom modifier');
      },
    });

    // first update callback
    options.onFirstUpdate = (state) => {
      console.log('onFirstUpdate', state);
      if (state.elements?.arrow) {
        state.elements.arrow.style.display = 'none';
      }
    };

    return options;
  };

  procesarFrom = this.fb.group(
    {
      medio: ['', [Validators.required]],
      pref: [{ disabled: true, value: '' }, [Validators.required]],
      numero: [
        { disabled: true, value: '' },
        [Validators.required, Validators.minLength(7)],
      ],
      referencia: ['', [Validators.required, Validators.minLength(6)]],
    },
    { updateOn: 'blur' }
  );

  procesarFrom1 = this.fb.group(
    {
      medio: ['', [Validators.required]],
      pref: [{ disabled: true, value: '' }, [Validators.required]],
      numero: [
        { disabled: true, value: '' },
        [Validators.required, Validators.minLength(7)],
      ],
      referencia: ['', [Validators.required, Validators.minLength(6)]],
    },
    { updateOn: 'blur' }
  );

  addReporte(medio: any, pref: any, numero: any, referencia: any) {
    var medioName = '';
    var telefonoFinal = '';
    this.procesarFrom.setValue({
      medio: medio,
      pref: pref,
      numero: numero,
      referencia: referencia,
    });

    this.procesarFrom.markAllAsTouched();

    if (this.procesarFrom.valid) {
      var val = [];
      val = this.arrayReporte.filter(
        (item: any) => item.referencia == referencia
      );
      if (val.length == 0) {
        this.obj = {
          id: 0,
          flujo: 0,
          medioMuestra: '',
          telefono: '',
          telefonoMuestra: '',
          referencia: '',
        };

        switch (parseInt(medio)) {
          case 1:
            medioName = 'Zelle';
            break;
          case 2:
            medioName = 'Transferencias';
            break;
          case 3:
            medioName = 'Pago Móvil';
            break;
        }

        if (pref == '') {
          telefonoFinal = '-';
        } else {
          telefonoFinal = '0' + pref + '-' + numero;
        }
        var id = 0;
        if (this.arrayReporte.length > 0) {
          this.arrayReporte.forEach((element: any) => {
            if (element.id > id) {
              id = element.id;
            }
          });
          id = id + 1;
        } else {
          id = this.arrayReporte.length + 1;
        }

        this.obj = {
          id: id,
          flujo: medio,
          medioMuestra: medioName,
          telefono: pref + numero,
          telefonoMuestra: telefonoFinal,
          referencia: referencia,
        };

        this.arrayReporte.push(this.obj);

        this.valueMedia.nativeElement.value = '';
        this.valuePref.nativeElement.value = '';
        this.valueNumero.nativeElement.value = '';
        this.valueReferencia.nativeElement.value = '';

        this.toastr.success('Agregado exitosamente');
      } else {
        this.toastr.error('Reporte ya agregado');
      }
    }
  }

  dltReporte(id: any) {
    let val = this.arrayReporte.filter((item: any) => id != item.id);

    this.arrayReporte = val;

    this.toastr.success('Eliminado exitosamente');
  }

  contador: number = 0;
  onFileSelected(event: any) {
    this.contador=0;
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);

    reader.onload = (event: any) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      var arrayImport: any = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      this.toastr.info('Iniciando proceso de importación');

      for (let index = 1; index < arrayImport.length; index++) {
        let element = arrayImport[index];
        var medioImport = '';
        this.obj = {
          id: 0,
          flujo: 0,
          medioMuestra: '',
          telefono: '',
          telefonoMuestra: '',
          referencia: '',
        };
        //validacion metodo
        if (
          element[0] == 'Pago Movil' ||
          element[0] == 'Transferencia' ||
          element[0] == 'Zelle'
        ) {
          //Asignar medio
          switch (element[0]) {
            case 'Pago Movil':
              medioImport = '3';
              break;
            case 'Transferencia':
              medioImport = '2';
              break;
            case 'Zelle':
              medioImport = '1';
              break;
          }
          //validacion de referencia
          if (element[1].toString().length >= 7) {
            let val = [];
            val = this.arrayReporte.filter(
              (item: any) =>
                item.referencia == element[1].toString() &&
                item.flujo == medioImport
            );
            if (val.length == 0) {
              //validacion de si es pago movil
              if (medioImport == '3') {
                //validacion de prefijo
                if (
                  element[2] == 412 ||
                  element[2] == 414 ||
                  element[2] == 424 ||
                  element[2] == 416 ||
                  element[2] == 426
                ) {
                  //validacion de numero
                  if (element[3].toString().length == 7) {
                    //Completar proceso de pago movil
                    var idimport = 0;
                    if (this.arrayReporte.length > 0) {
                      this.arrayReporte.forEach((element: any) => {
                        if (element.id > idimport) {
                          idimport = element.id;
                        }
                      });
                      idimport = idimport + 1;
                    } else {
                      idimport = this.arrayReporte.length + 1;
                    }
                    let prefFinal = '';
                    let numeroFinal = '';
                    let referenciaFinal = '';
                    prefFinal = element[2].toString();
                    numeroFinal = element[3].toString();
                    referenciaFinal = element[1].toString();

                    this.obj = {
                      id: idimport,
                      flujo: medioImport,
                      medioMuestra: element[0],
                      telefono: prefFinal + numeroFinal,
                      telefonoMuestra: '0' + prefFinal + '-' + numeroFinal,
                      referencia: referenciaFinal,
                    };

                    this.arrayReporte.push(this.obj);
                  } else {
                    this.contador = this.contador + 1;
                  }
                } else {
                  this.contador = this.contador + 1;
                }
              } else {
                //Completar proceso de zelle/Transferencia
                var idimport = 0;
                if (this.arrayReporte.length > 0) {
                  this.arrayReporte.forEach((element: any) => {
                    if (element.id > idimport) {
                      idimport = element.id;
                    }
                  });
                  idimport = idimport + 1;
                } else {
                  idimport = this.arrayReporte.length + 1;
                }

                this.obj = {
                  id: idimport,
                  flujo: medioImport,
                  medioMuestra: element[0],
                  telefono: '',
                  telefonoMuestra: '-',
                  referencia: element[1],
                };

                this.arrayReporte.push(this.obj);
              }
            } else {
              this.contador = this.contador + 1;
            }
          } else {
            this.contador = this.contador + 1;
          }
        } else {
          this.contador = this.contador + 1;
        }
      }
      setTimeout(() => {

        if (this.contador > 0 && this.contador <  arrayImport.length-1) {
          this.toastr.info(
            'se importo con algunos registros que no completaron la validación',
            'Se importo incompleto'
          );
        } else {

          if(this.contador == arrayImport.length-1){
            this.toastr.error(
              'los registros no completaron no cumplen con la validación',
              'No se importo'
            );
          }else{
            this.toastr.success('Importartación Completada');
          }
        }


      }, 100);
    };
    //* Elimina la cola de archivo de un input...
    this.file.nativeElement.value = '';
    // event.currentTarget.files[0] = null;
  }

  reportarPagoLote() {
    this.arrayReporte.forEach((element: any) => {
      this.reportarPago(element);
    });

    this.arrayReporte = [];
  }

  reportarPago(json: any) {
    var telefono: any;
    if (json.flujo != '3') {
      telefono = null;
    } else {
      telefono = json.telefono;
    }

    var objReporte = {
      documento: this.json.documento,
      telefono: telefono,
      referencia: json.referencia,
      tipo: json.flujo,
    };

    this.ReporteService.postReporte(objReporte).subscribe({
      next: (data) => {
        let resultado = data;
        this.toastr.success('Reportado Exitosamente');
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
}
