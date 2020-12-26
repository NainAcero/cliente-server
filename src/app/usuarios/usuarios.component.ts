import { Component, OnInit } from '@angular/core';
import { AuthService } from '../login/auth.service';
import { UsuarioService } from './usuario.service';
import { tap } from 'rxjs/operators';
import { Usuario } from '../login/usuario';
import { NewTalonario } from '../models/talonario';
import { TalonarioService } from '../services/talonario.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[];
  paginador: any;
  usuarioSelec : Usuario;
  buscar: String = '';

  filas = [1,1,1,1,1];
  columnas = [1,1,1,1,1];

  talonario = new NewTalonario;

  constructor(
    public authService: AuthService,
    private _usuarioService: UsuarioService,
    private _talonarioService: TalonarioService,
    private _activatedRoute:ActivatedRoute
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
    this._activatedRoute.paramMap.subscribe(params => {
      let page: number = +params.get('page');

      if(!page){
        page = 0;
      }

      this._usuarioService.getUsuarios(page)
      .pipe(
        tap((response: any) => {
          (response.usuarios as Usuario[]);
        })
      )
      .subscribe(response => {
        this.usuarios = response.usuarios as Usuario[];
        this.paginador = response;
      });

    });
  }

  guardar(){

    this.talonario.usuario_id = this.usuarioSelec._id;
    for(let i = 0; i < this.filas.length ; i++){
      for(let j = 0; j < this.columnas.length ; j++){
        var val = (<HTMLInputElement>document.getElementById('numero[' + i + '][' + j + ']')).value;

        this.talonario.talonario.push({ 'numero': parseInt(val),  'salio': 0  } );
      }
    }

    this._talonarioService.guardarTalonario(this.talonario).subscribe(response => {

      // console.log(response);
      this.talonario.talonario = new Array();
      for(let i = 0; i < this.filas.length ; i++){
        for(let j = 0; j < this.columnas.length ; j++){
          var val = (<HTMLInputElement>document.getElementById('numero[' + i + '][' + j + ']')).value = "";
        }
      }
      Swal.fire('Cartilla Registrada', `Cartilla registrada con éxito!`, 'success');

    }, err => {
      console.log(err);
      Swal.fire('Error Login', 'Ocurrio un Error!', 'error');
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
