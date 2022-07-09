import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../servicios/global';
import { UploadService } from '../servicios/upload.service';
import { MusicaService } from '../servicios/musica.service';
import { UserService } from '../servicios/user.service';
import { Musica } from '../modelos/musica';

@Component({
  selector: 'musica-editar',
  templateUrl: '../views/musica-editar.html',
  providers: [UserService,MusicaService,UploadService]
})

export class MusicaEditarComponent implements OnInit {
  public titulo: string;
  public musica: Musica;
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public is_edit;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _uploadService: UploadService,
    private _musicaService: MusicaService) {
    this.titulo = 'Modificar Canción';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.musica = new Musica('', '', 0, 0, '', '');
    this.is_edit=true;
  }

  ngOnInit() {
    console.log('musica-editar.component.ts Cargado');
    //Obtener la canción a editar
    this.getMusica();

  }

  getMusica() {
    // console.log(this.album);
    let id = this._route.snapshot.params['id'];
    this._musicaService.getMusica(this.token, id).subscribe(
      response => {
        if (!response['musica']) {
          this._router.navigate(['/']);
        } else {
          this.musica = response['musica'];
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

  onSubmit() {
    let id = this._route.snapshot.params['id'];
    //console.log(this.musica); 

    this._musicaService.update_musica(this.token, id, this.musica).subscribe(
      response => {
        if (!response['musica']) {
          this.alertMessage = "Error en el servidor";
        } else {
          this.alertMessage = "¡La canción se ha Actualizado correctamente!";
          //Subir la audio
          this._uploadService.makeFileRequest(this.url+'upload-file-musica/'+id,[],this.filesToUpload,this.token).then(
            (result: any) => {              
              this._router.navigate(['/album',this.musica.album['_id']]);               
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