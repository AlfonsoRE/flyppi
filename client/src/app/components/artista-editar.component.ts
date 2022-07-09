import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../servicios/global';
import { UserService } from '../servicios/user.service';
import { UploadService } from '../servicios/upload.service';
import { ArtistaService } from '../servicios/artista.service';
import { Artista } from '../modelos/artista';

@Component({
  selector: 'artista-editar',
  templateUrl: '../views/artista-editar.html',
  providers: [UserService, ArtistaService, UploadService]
})

export class ArtistaEditarComponent implements OnInit {
  public titulo: string;
  public artista: Artista;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public is_edit;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService,
    private _artistaService: ArtistaService) {
    this.titulo = 'Crear nuevo artista';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.artista = new Artista('', '', '', '');
    this.is_edit = true;
  }

  ngOnInit(): void {
    console.log('artista-editar.component.ts Cargado');

    //llamar al metodo del api para sacar un artista en base a su id
    this.getArtista();
  }

  public filesToUpload: Array<File>;

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  }

  getArtista() {
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
  }


  onSubmit(): void {
    let id = this._route.snapshot.params['id'];
    this._artistaService.update_artista(this.token, id, this.artista).subscribe(
      response => {
        if (!response['artista']) {
          this.alertMessage = "Error en el servidor";
        } else {
          this.alertMessage = "El artista se ha actualizado correctamente";
          if (!this.filesToUpload) {
            this._router.navigate(['/artista', id]);
          } else {
            //subir la imagen del artista
            this._uploadService.makeFileRequest(this.url + 'upload-image-artista/' + id, [], this.filesToUpload, this.token).then(
              (result: any) => {
                this._router.navigate(['/artistas', 1]);
              }, (error) => {
                console.log(error);
              });
            // this._router.navigate(['/editar-artista'], response['artista']._id);
          }
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