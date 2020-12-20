import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { TalonarioService } from '../services/talonario.service';
import { SocketService } from './socket.service';
import { Talonario } from '../models/talonario';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  bolillas = [];
  cartillas = [];

  constructor(
    private _authService: AuthService,
    public _socketService: SocketService,
    public _talonarioService: TalonarioService
  ) {
  }

  ngOnInit(): void {
    // this._socketService.emit('sacar_numero', { nombre: 'Nain Acero' });
    this.listenSocket();
    this._talonarioService.getTalonario()
    .subscribe(response => {

      this.cartillas = response.data;
    });

  }

  listenSocket(): void {

    this._socketService.listen( 'obtener_numero' ).subscribe( (response: Number) => {
      this.bolillas.push(response);

      this.cartillas = this.cartillas.map(element => {
        element.talonario.map(value => {

          if(value.numero == response){
            value.salio = 1;
          }

          return value;
        });

        return element;
      })

      console.log(this.cartillas);
    });


  }

}
