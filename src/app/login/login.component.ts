import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Usuario } from './usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = "Por Favor Sign In!";
  usuario: Usuario;

  constructor(
    private _authService: AuthService,
    private _router: Router
  ) {
    this.usuario = new Usuario();
  }

  ngOnInit(): void {
  }

  login(): void{
    if(this.usuario.email == null || this.usuario.dni == null){
      Swal.fire('Error Login', 'Email o DNI vacías!', 'error');
      return;
    }

    this._authService.login(this.usuario).subscribe(response => {

      // console.log(response);
      this._authService.guardarUsuario(response.token);
      this._authService.guardarToken(response.token);
      let usuario = this._authService.usuario;

      this._router.navigate(['/home']);
      Swal.fire('Login', `Hola ${usuario.nombre}, has iniciado sesión con éxito!`, 'success');
    }, err => {
      Swal.fire('Error Login', 'Email o DNI incorrecto!', 'error');
    });
  }
}
