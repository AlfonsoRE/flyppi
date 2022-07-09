import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../servicios/global';
import { UserService } from '../servicios/user.service';
import { ArtistaService } from '../servicios/artista.service';
import { Artista } from '../modelos/artista';

@Component({
    selector: 'artista-lista',
    templateUrl: '../views/artista-lista.html',
    providers: [UserService, ArtistaService]
})

export class ArtistaListaComponent implements OnInit {
    public titulo: string;
    public artistas: Artista[];
    public identity;
    public token;
    public url: string;
    public next_page;
    public prev_page;
    public confirmado;


    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private _artistaService: ArtistaService,
        private _userService: UserService) {
        this.titulo = 'Artista';
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.url = GLOBAL.url;
        this.next_page = 1;
        this.prev_page = 1;
    }

    ngOnInit(): void {
        console.log('Artista-lista.component.ts Cargado');

        //conseguir el listado de artistas.
        this.getArtistas();
    }

    getArtistas() {
        this._route.params.forEach((params: Params)=>{
            let page = +params['page'];
        if (!page) {
            page = 1;
        } else {
            this.next_page = page + 1;
            this.prev_page = page - 1;
            if (this.prev_page == 0) {
                this.prev_page = 1;
            }
        }
        this._artistaService.getArtistas(this.token, page).subscribe(
            response => {
                if (!response['artistas']) {
                    this._router.navigate(['/']);
                } else {
                    this.artistas = response['artistas'];
                }
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {
                   // this.alertMessage = error.error.message;
                    console.log(error.error.message);
                }
            }
        );
        });
    }

    onDeleteConfirm(id){
        this.confirmado = id;
    }

    onCancelArtista(){
        this.confirmado=null;
    }

    onDeleteArtista(id){
        this._artistaService.delete_artista(this.token,id).subscribe(
            response => {
                if (!response['artista']) {
                   alert("Error en el servidor");
                } 
                this.getArtistas();
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {
                   // this.alertMessage = error.error.message;
                    console.log(error.error.message);
                }
            }
        );
    }

}