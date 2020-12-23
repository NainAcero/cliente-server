import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './login/guards/auth.guard';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { RegisterComponent } from './register/register.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { AdministracionComponent } from './administracion/administracion.component';
import { RoleGuard } from './login/guards/role.guard';
import { PaginateComponent } from './paginate/paginate.component';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

var _token = null;

if(sessionStorage.getItem('token') != null)  _token = sessionStorage.getItem('token');

const config: SocketIoConfig = { url: 'https://bingo-2020.herokuapp.com',
  options: { transports: ['websocket'], allowUpgrades : true, query: `token=${_token}` } };

  // const config: SocketIoConfig = { url: 'http://localhost:3000',
  // options: { transports: ['websocket'], allowUpgrades : true, query: `token=${_token}` } };

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent, canActivate:[AuthGuard] },
  {path: 'usuarios', component: UsuariosComponent, canActivate:[AuthGuard, RoleGuard] , data: {role: 'ADMINISTRADOR'}},
  {path: 'administracion', component: AdministracionComponent, canActivate:[AuthGuard, RoleGuard] , data: {role: 'ADMINISTRADOR'}},
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    UsuariosComponent,
    AdministracionComponent,
    PaginateComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
