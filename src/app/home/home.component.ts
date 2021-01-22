import { Component, OnInit } from '@angular/core';
import SwiperCore, { Mousewheel, Pagination } from "swiper/core";
import { AuthService } from '../login/auth.service';
import { BolillaService } from '../services/bolilla.service';
import { TalonarioService } from '../services/talonario.service';
import { SocketService } from './socket.service';
import Swal from 'sweetalert2';

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

  bingo(){
    var check = 0;
    this.cartillas.forEach(cartilla => {
      var con = 0;
      cartilla.talonario.forEach(value => {
        if(value.salio == 1){
          con ++;
        }
      });
      if(con == 24){
        check = 1;
      }
    });

    if(check == 1){

      var user = {
        nombre: this._authService.usuario.nombre.toUpperCase(),
        email: this._authService.usuario.email,
        telefono: this._authService.usuario.telefono
      };

      this._socketService.emit('bingo_emit', user);

      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Se marco su bingo',
        showConfirmButton: false,
        timer: 1500
      });
    }else{

      Swal.fire({
        position: 'top-end',
        icon: 'warning',
        title: 'Catillas Imcompletas',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

}
