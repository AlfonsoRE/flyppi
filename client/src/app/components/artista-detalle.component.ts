import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../servicios/global';
import { UserService } from '../servicios/user.service';
import { ArtistaService } from '../servicios/artista.service';
import { AlbumService } from '../servicios/album.service';
import { Artista } from '../modelos/artista';
import { Album } from '../modelos/album';

@Component({
  selector: 'artista-detalle',
  templateUrl: '../views/artista-detalle.html',
  providers: [UserService, ArtistaService, AlbumService]
})

export class ArtistaDetalleComponent implements OnInit {
  public artista: Artista;
  public albums: Album[];
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public confirmado;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _artistaService: ArtistaService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artista = new Artista('', '', '', '');
  }

  ngOnInit(): void {
    console.log('artista-editar.component.ts Cargado');

    //llamar al metodo del api para sacar un artista en base a su id
    this.getArtista();
  }


  getArtista() {
    let id = this._route.snapshot.params['id'];

    this._artistaService.getArtista(this.token, id).subscribe(
      response => {
        if (!response['artista']) {
          this._router.navigate(['/']);
        } else {
          this.artista = response['artista'];
          //Sacar los albums del artista.
          this._albumService.getAlbums(this.token, this.artista._id).subscribe(
            response => {
              if (!response['albums']) {
                this.alertMessage = "Este artista no tiene Albums";
              } else {
                this.albums = response['albums'];
                console.log(this.albums);
              }
            },
            error => {
              var errorMessage = <any>error;
              if (errorMessage != null) {
                //  this.alertMessage = error.error.message;
                console.log(error);
              }
            }
          );
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          //  this.alertMessage = error.error.message;
          console.log(error);
        }
      }
    );
  }

  onDeleteConfirm(id) {
    this.confirmado = id;
  }

  onCancelAlbum() {
    this.confirmado = null;
  }

  onDeleteAlbum(id) {
    this._albumService.delete_album(this.token, id).subscribe(
      response => {
        if (!response['album']) {
          alert("Error en el servidor");
        }else{
          this.getArtista();
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
  }

}