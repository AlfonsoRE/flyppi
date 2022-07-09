import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../servicios/global';
import { UserService } from '../servicios/user.service';
import { ArtistaService } from '../servicios/artista.service';
import { Artista } from '../modelos/artista';

@Component({
    selector: 'artista-add',
    templateUrl: '../views/artista-add.html',
    providers: [UserService, ArtistaService]
})

export class ArtistaAddComponent implements OnInit {
    public titulo: string;
    public artista: Artista;
    public identity;
    public token;
    public url: string;
    public alertMessage;

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private _userService: UserService,
        private _artistaService: ArtistaService) {
        this.titulo = 'Crear nuevo artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.artista = new Artista('', '', '','');
    }

    ngOnInit(): void {
        console.log('artista-add.component.ts Cargado');
        //conseguir el listado de artistas.
    }

    onSubmit(): void {
        this._artistaService.addArtista(this.token,this.artista).subscribe(
            response =>{
              if(!response['artista']){
               this.alertMessage = "Error en el servidor";
              }else{                
               this.alertMessage = "El artista se ha creado correctamente";
                this.artista = response['artista'];
                this._router.navigate(['/editar-artista', response['artista']._id]);                                
              }
            },
            error=>{
              var errorMessage = <any>error;
              if(errorMessage!=null){
                this.alertMessage = error.error.message;
                console.log(error);
              }
            }
          );
    }

}