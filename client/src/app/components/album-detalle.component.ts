import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../servicios/global';
import { UserService } from '../servicios/user.service';
import { AlbumService } from '../servicios/album.service';
import { MusicaService } from '../servicios/musica.service';
import { Album } from '../modelos/album';
import { Musica } from '../modelos/musica';


@Component({
  selector: 'album-detalle',
  templateUrl: '../views/album-detalle.html',
  providers: [UserService, AlbumService, MusicaService]
})

export class AlbumDetalleComponent implements OnInit {
  public album: Album;
  public musicas: Musica[];
  public identity;
  public token;
  public url: string;
  public alertMessage;
  public confirmado;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _musicaService: MusicaService,
    private _albumService: AlbumService) {
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.album = new Album('', '', '', 2022, '', '');
  }

  ngOnInit(): void {
    console.log('album-detalle.component.ts Cargado');

    //llamar al metodo del api para sacar un artista en base a su id
    this.getAlbum();
  }


  getAlbum() {
    let id = this._route.snapshot.params['id'];

    this._albumService.getAlbum(this.token, id).subscribe(
      response => {
        if (!response['album']) {
          this._router.navigate(['/']);
        } else {
          this.album = response['album'];

          //Sacar las canciones del album
          this._musicaService.getMusicas(this.token, this.album._id).subscribe(
            response => {
              if (!response['musicas']) {
                this.alertMessage = "Este album no tiene canciones";
              } else {
                this.musicas = response['musicas'];
                console.log(this.musicas);
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

  onCancelMusica() {
    this.confirmado = null;
  }

  onDeleteMusica(id) {    
    this._musicaService.delete_musica(this.token, id).subscribe(
      response => {
        if (!response['musica']) {
          alert("Error en el servidor");
        }
        this.getAlbum();
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

  startPlayer(musica: Musica){
    let mus = JSON.stringify(musica);
    let file_path = this.url +'get-musica-file/'+musica.file;
    let image_path = this.url +'get-image-album/'+ musica.album['imagen'];
    console.log(mus);
    localStorage.setItem('musica_actual',mus);
    document.getElementById("mp3-source")!.setAttribute('src',file_path);
    (document.getElementById("player") as any)!.load();
    (document.getElementById("player") as any)!.play();      
    
    document.getElementById("play-song-title")!.innerHTML = musica.nombre;
    //document.getElementById("play-song-artista")!.innerHTML = "ok bien";
    document.getElementById("play-image-album")!.setAttribute('src',image_path);

                    
  }

}