import { Component,OnInit } from '@angular/core';
import {UserService} from './servicios/user.service';
import { Usuario } from './modelos/usuario';
import { GLOBAL } from "./servicios/global";
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers: [UserService]
})
export class AppComponent implements OnInit {
  public title = 'Flyppi' ;
  public user: Usuario ;
  public user_register: Usuario ;
  public identity ;
  public token;
  public errorMessage;
  public alertRegister;
  public url;

  constructor(private _route: ActivatedRoute,
    private _router: Router, private _userService:UserService){
    this.user = new Usuario('','','','','','ROLE_USER','');
    this.user_register = new Usuario('','','','','','ROLE_USER','');
    this.url = GLOBAL.url;

  }

  ngOnInit(){
    this.identity = this._userService.getIdentity();
    this.token =this._userService.getToken(); 
    console.log(this.identity);
    console.log(this.token);   
  }
 

  public onSubmit(){
    //Conseguir los datos del usuario identificado
    this._userService.signup(this.user,null).subscribe(
      response =>{
        let identity = response['user'];
        this.identity = identity;
        if(!this.identity._id){
          alert("El usuario no esta correctamente identi");
        }else{
          //Crear elemento en el localStorage para tener al usuario en sesión
          localStorage.setItem('identity',JSON.stringify(identity));
          
          //Conseguir el token para enviarselo a cada petición http
          this._userService.signup(this.user,true).subscribe(
            response =>{
              let token = response['token'];
              this.token = token;
              if(this.token.length<=0){
                alert("El token no se ha generado");
              }else{
                //Crear elemento en el localStorage para tener al usuario en sesión
                localStorage.setItem('token',token);
                this.user = new Usuario('','','','','','ROLE_USER','');
                //Conseguir el token para enviarselo a cada petición http
              }
            },
            error=>{
              var errorMessage = <any>error;
              if(errorMessage!=null){
                this.errorMessage = error.error.message;
                console.log(error);
              }
            }
          );
        
        }
      },
      error=>{
        var errorMessage = <any>error;
        if(errorMessage!=null){
          this.errorMessage = error.error.message;
          console.log(error);
        }
      }
    );
  }

  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity=null;
    this.token=null;  
    this._router.navigate(['/']);
  }

  onSubmitRegister(){
    console.log(this.user_register);
    this._userService.register(this.user_register).subscribe(response =>{
     let user = response['user'];
     this.user_register = user;
     if(!user._id){
      this.alertRegister ='Error al registrarse';
     }else{
      this.alertRegister = "El registro se ha realizado correctamente, identificate con "+this.user_register.email;      
      this.user_register = new Usuario('','','','','','ROLE_USER','');
    }
    },
    error=>{
      var errorMessage = <any>error;
      if(errorMessage!=null){
        this.alertRegister = error.error.message;
        console.log(this.alertRegister);
      }
    }      
    );
  }

}
