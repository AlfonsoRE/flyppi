import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../servicios/global';
import { MusicaService } from '../servicios/musica.service';
import { UserService } from '../servicios/user.service';
import { Musica } from '../modelos/musica';

@Component({
  selector: 'musica-add',
  templateUrl: '../views/musica-add.html',
  providers: [UserService,MusicaService]
})

export class MusicaAddComponent implements OnInit {
  public titulo: string;
  public musica: Musica;
  public identity;
  public token;
  public url: string;
  public alertMessage;

  constructor(private _route: ActivatedRoute,
    private _router: Router,
    private _userService: UserService,
    private _musicaService: MusicaService) {
    this.titulo = 'Crear nueva Canción';
    this.identity = this._userService.getIdentity();
    this.token = this._userService.getToken();
    this.url = GLOBAL.url;
    this.musica = new Musica('', '', 0, 0, '', '');
  }

  ngOnInit() {
    console.log('musica-add.component.ts Cargado');
    //conseguir el listado de artistas.
  }

  onSubmit() {
    let id = this._route.snapshot.params['album'];
    this.musica.album = id;
    //console.log(this.musica); 

    this._musicaService.addMusica(this.token, this.musica).subscribe(
      response => {
        if (!response['musica']) {
          this.alertMessage = "Error en el servidor";
        } else {
          this.alertMessage = "¡La canción se ha creado correctamente!";
          this.musica = response['musica'];
          this._router.navigate(['/editar-cancion', this.musica._id]);
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