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

  bolillas = [];
  numero: Number;

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
      });
    });
  }

  sacar_numero(){
    console.log(this.numero);
    this._socketService.emit('sacar_numero', this.numero );
  }

  listenSocket(): void {
    this._socketService.listen( 'obtener_numero' ).subscribe( (data: any) => {
      this.bolillas.push(data);
      this.numero = null;
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
