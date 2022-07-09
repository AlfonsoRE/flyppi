import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../servicios/global';
import { UserService } from '../servicios/user.service';
import { AlbumService } from '../servicios/album.service';
import { UploadService } from '../servicios/upload.service';
import { Album } from '../modelos/album';

@Component({
  selector: 'album-editar',
  templateUrl: '../views/album-editar.html',
  providers: [UserService, AlbumService,UploadService]
})

export class AlbumEditarComponent implements OnInit {
  public titulo: string;
  public album: Album;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public is_edit;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService,
    private _albumService: AlbumService) {
    this.titulo = 'Editar nuevo Album';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('', '', '', 2022, '', '');
    this.is_edit = true;
  }

  getArtista() {
    /*
    let id = this._route.snapshot.params['id'];

    this._artistaService.getArtista(this.token, id).subscribe(
      response => {
        if (!response['artista']) {
          this._router.navigate(['/']);
        } else {
          this.artista = response['artista'];
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
    */
  }


  ngOnInit(): void {
    console.log('album-add.component.ts Cargado');
    //conseguir el album.
    this.getAlbum();
  }

  getAlbum(): void {
    // console.log(this.album);
    let id = this._route.snapshot.params['id'];
    this._albumService.getAlbum(this.token, id).subscribe(
      response => {
        if (!response['album']) {
          this._router.navigate(['/']);
        } else {
          this.album = response['album'];
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


  public filesToUpload: Array<File>;

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }


  onSubmit(): void {
    // console.log(this.album);
    let id = this._route.snapshot.params['id'];

    this._albumService.update_album(this.token, id, this.album).subscribe(
      response => {
        if (!response['album']) {
          this.alertMessage = "Error en el servidor";
        } else {
          this.alertMessage = "¡El album se ha actualizado correctamente!";
          this.album = response['album'];
          //Subir la Imagen
          this._uploadService.makeFileRequest(this.url+'upload-image-album/'+id,[],this.filesToUpload,this.token).then(
            (result: any) => {              
              this._router.navigate(['/artista',this.album.artista]);               
            },(error) => {
              console.log(error);
            });
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