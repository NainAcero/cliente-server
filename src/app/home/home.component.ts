import { Component, OnInit } from '@angular/core';
import SwiperCore, { Mousewheel, Pagination } from "swiper/core";
import { AuthService } from '../login/auth.service';
import { BolillaService } from '../services/bolilla.service';
import { TalonarioService } from '../services/talonario.service';
import { SocketService } from './socket.service';

SwiperCore.use([Pagination,Mousewheel]);
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  bolillas = [];
  cartillas = [];
  swiperConfig = {
      direction : 'vertical',
      spaceBetween: 10,
      mousewheel: true,
      pagination: {
      clickable: true,
      renderBullet: function (index, className) {
        return '<span class="' + className + '">' + (index + 1) + '</span>';
      }
    }
  };

  constructor(
    private _authService: AuthService,
    public _socketService: SocketService,
    public _talonarioService: TalonarioService,
    private _bolillaService: BolillaService
  ) {
  }

  ngOnInit(): void {
    // this._socketService.emit('sacar_numero', { nombre: 'Nain Acero' });

    this.listenSocket();
    this._talonarioService.getTalonario()
    .subscribe(response => {

      this.cartillas = response.data;
    });

    this._bolillaService.getBolilla()
    .subscribe(response => {

      response.bolillas.forEach((bolilla) => {
        this.bolillas.push(bolilla.numero);
      });
    });
  }

  listenSocket(): void {
    console.log('escuchando');
    this._socketService.listen('obtener_numero').subscribe( (response: Number) => {
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
