import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { SocketService } from '../home/socket.service';
import { AuthService } from '../login/auth.service';

@Component({
  selector: 'app-administracion',
  templateUrl: './administracion.component.html',
  styleUrls: ['./administracion.component.css']
})
export class AdministracionComponent implements OnInit {

  bolillas = [];

  constructor(
    private _authService: AuthService,
    private _socketService: SocketService,
  ) { }

  ngOnInit(): void {
    this.listenSocket();
  }

  sacar_numero(){

    this._socketService.emit('sacar_numero', { data: 'BINGO_2020' });
  }

  listenSocket(): void {
    this._socketService.listen( 'obtener_numero' ).subscribe( (data: any) => {
      this.bolillas.push(data);
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
