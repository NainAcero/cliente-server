import { Component, OnInit } from '@angular/core';
import { tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AuthService } from '../login/auth.service';
import { Usuario } from '../login/usuario';
import { NewTalonario } from '../models/talonario';
import { TalonarioService } from '../services/talonario.service';
import { UsuarioService } from './usuario.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[];
  usuarioSelec : Usuario;
  buscar: String = '';

  filas = [1,1,1,1,1];
  columnas = [1,1,1,1,1];

  talonario = new NewTalonario;

  constructor(
    public authService: AuthService,
    private _usuarioService: UsuarioService,
    private _talonarioService: TalonarioService
  ) {

    this.talonario.talonario = new Array();
  }

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  guardar_usuario(usuario: Usuario) {

    this.usuarioSelec = usuario;
  }

  cargarUsuarios(){
    this._usuarioService.getUsuarios(0)
    .pipe(
      tap((response: any) => {
        (response.usuarios as Usuario[]);
      })
    )
    .subscribe(response => {
      this.usuarios = response.usuarios as Usuario[];
    });
  }

  guardar(){

    this.talonario.usuario_id = this.usuarioSelec.uid;
    for(let i = 0; i < this.filas.length ; i++){
      for(let j = 0; j < this.columnas.length ; j++){
        var val:string;
        if(i===2 && j===2) val="0";
        else val = (<HTMLInputElement>document.getElementById('numero[' + i + '][' + j + ']')).value;

        this.talonario.talonario.push({ 'numero': parseInt(val),  'salio': 0  } );
      }
    }

    this._talonarioService.guardarTalonario(this.talonario).subscribe(response => {

      // console.log(response);
      this.talonario.talonario = new Array();
      for(let i = 0; i < this.filas.length ; i++){
        for(let j = 0; j < this.columnas.length ; j++){
          if(i===2 && j===2) continue;
          var val = (<HTMLInputElement>document.getElementById('numero[' + i + '][' + j + ']')).value = "";
        }
      }
      Swal.fire('Cartilla Registrada', `Cartilla registrada con éxito!`, 'success');

    }, err => {
      Swal.fire('Error Login', 'Email o DNI ya registrados!', 'error');
    });
  }

  buscarUsuario(){
    this._usuarioService.buscarUser(this.buscar)
    .pipe(
      tap((response: any) => {
        (response.usuarios as Usuario[]);
      })
    )
    .subscribe(response => {
      this.usuarios = response.usuarios as Usuario[];
    });
  }

  valuechange( event ){
    if( this.buscar.length == 0 ){
      this.cargarUsuarios();
    }
  }
}
