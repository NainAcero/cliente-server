import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SocketService } from '../home/socket.service';
import { AuthService } from '../login/auth.service';
import { BolillaService } from '../services/bolilla.service';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {

  bolillas:number[] = [];
  numero: Number;
  bingo = ["B","I","N","G","O"];
  // TODO: reemplazar con mongodb
  elementos = [
    [
      {"numero" : 1,"salio" : 0},{"numero" : 2,"salio" : 0},{"numero" : 3,"salio" : 0},{"numero" : 4,"salio" : 0},{"numero" : 5,"salio" : 0},
      {"numero" : 6,"salio" : 0},{"numero" : 7,"salio" : 0},{"numero" : 8,"salio" : 0},{"numero" : 9,"salio" : 0},{"numero" : 10,"salio" : 0},
      {"numero" : 11,"salio" : 0},{"numero" : 12,"salio" : 0},{"numero" : 13,"salio" : 0},{"numero" : 14,"salio" : 0},{"numero" : 15,"salio" : 0}
    ],
    [
      {"numero" : 16,"salio" : 0},{"numero" : 17,"salio" : 0},{"numero" : 18,"salio" : 0},{"numero" : 19,"salio" : 0},{"numero" : 20,"salio" : 0},
      {"numero" : 21,"salio" : 0},{"numero" : 22,"salio" : 0},{"numero" : 23,"salio" : 0},{"numero" : 24,"salio" : 0},{"numero" : 25,"salio" : 0},
      {"numero" : 26,"salio" : 0},{"numero" : 27,"salio" : 0},{"numero" : 28,"salio" : 0},{"numero" : 29,"salio" : 0},{"numero" : 30,"salio" : 0}
    ],
    [
      {"numero" : 31,"salio" : 0},{"numero" : 32,"salio" : 0},{"numero" : 33,"salio" : 0},{"numero" : 34,"salio" : 0},{"numero" : 35,"salio" : 0},
      {"numero" : 36,"salio" : 0},{"numero" : 37,"salio" : 0},{"numero" : 38,"salio" : 0},{"numero" : 39,"salio" : 0},{"numero" : 40,"salio" : 0},
      {"numero" : 41,"salio" : 0},{"numero" : 42,"salio" : 0},{"numero" : 43,"salio" : 0},{"numero" : 44,"salio" : 0},{"numero" : 45,"salio" : 0}
    ],
    [
      {"numero" : 46,"salio" : 0},{"numero" : 47,"salio" : 0},{"numero" : 48,"salio" : 0},{"numero" : 49,"salio" : 0},{"numero" : 50,"salio" : 0},
      {"numero" : 51,"salio" : 0},{"numero" : 52,"salio" : 0},{"numero" : 53,"salio" : 0},{"numero" : 54,"salio" : 0},{"numero" : 55,"salio" : 0},
      {"numero" : 56,"salio" : 0},{"numero" : 57,"salio" : 0},{"numero" : 58,"salio" : 0},{"numero" : 59,"salio" : 0},{"numero" : 60,"salio" : 0}
    ],
    [
      {"numero" : 61,"salio" : 0},{"numero" : 62,"salio" : 0},{"numero" : 63,"salio" : 0},{"numero" : 64,"salio" : 0},{"numero" : 65,"salio" : 0},
      {"numero" : 66,"salio" : 0},{"numero" : 67,"salio" : 0},{"numero" : 68,"salio" : 0},{"numero" : 69,"salio" : 0},{"numero" : 70,"salio" : 0},
      {"numero" : 71,"salio" : 0},{"numero" : 72,"salio" : 0},{"numero" : 73,"salio" : 0},{"numero" : 74,"salio" : 0},{"numero" : 75,"salio" : 0}
    ],
  ];

  constructor(
    private _authService: AuthService,
    private _socketService: SocketService,
    private _bolillaService: BolillaService
  ) { }

  ngOnInit(): void {
    this.listenSocket();

    this._bolillaService.getBolilla()
    .subscribe(response => {

      response.bolillas.forEach((bolilla) => {
        this.bolillas.push(bolilla.numero);
        this.elementos = this.elementos.map(element => {
          element.map(value => {

            if(value.numero == bolilla.numero){
              value.salio = 1;
            }

            return value;
          });

          return element;
        });
      });
    });
  }

  sacar_numero(){
    //console.log(this.numero);
    this.numero = Math.floor(Math.random() * (75 - 1)) + 1;
    this._socketService.emit('sacar_numero', this.numero);

  }

  listenSocket(): void {
    this._socketService.listen( 'obtener_numero' ).subscribe( (data: any) => {
      this.bolillas.push(data);
      this.numero = null;
      this.elementos = this.elementos.map(element => {
        element.map(value => {

          if(value.numero == data){
            value.salio = 1;
          }

          return value;
        });

        return element;
      });
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Número: ' + data,
        showConfirmButton: false,
        timer: 1500
      })
    });
  }
}
