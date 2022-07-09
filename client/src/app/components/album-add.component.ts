import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../servicios/global';
import { UserService } from '../servicios/user.service';
import { ArtistaService } from '../servicios/artista.service';
import { AlbumService } from '../servicios/album.service';
import { Artista } from '../modelos/artista';
import { Album } from '../modelos/album';

@Component({
  selector: 'album-add',
  templateUrl: '../views/album-add.html',
  providers: [UserService, ArtistaService, AlbumService]
})

export class AlbumAddComponent implements OnInit {
  public titulo: string;
  public artista: Artista;
  public album: Album;
  public identity;
  public token;
  public url: string;
  public alertMessage;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _albumService: AlbumService,
    private _artistaService: ArtistaService) {
    this.titulo = 'Crear nuevo Album';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artista = new Artista('', '', '', '');
    this.album = new Album('', '', '', 2022, '', '');
  }

  ngOnInit(): void {
    console.log('album-add.component.ts Cargado');
    //conseguir el listado de artistas.
  }

  onSubmit(): void {
    // console.log(this.album);
    let id = this._route.snapshot.params['artista'];
    this.album.artista = id;
    this._albumService.addAlbum(this.token, this.album).subscribe(
      response => {
        if (!response['album']) {
          this.alertMessage = "Error en el servidor";
        } else {
          this.alertMessage = "¡El album se ha creado correctamente!";
          this.album = response['album'];
          this._router.navigate(['/editar-album', this.album._id]);
        }
      },
      error => {
        var errorMessage = <any>error;
        if (errorMessage != null) {
          this.alertMessage = error.error.message;
          console.log(error);
        }
      }
    );

  }

}