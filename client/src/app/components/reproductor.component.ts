import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GLOBAL } from '../servicios/global';
import { MusicaService } from '../servicios/musica.service';
import { UserService } from '../servicios/user.service';
import { Musica } from '../modelos/musica';

@Component({
  selector: 'reproductor',
  template: `
    <div class="album-image">
      <span *ngIf="musica.album">
         <img id="play-image-album" src="{{url + 'get-image-album/'+ musica.album['imagen']}}" />
      </span>
      <span *ngIf="!musica.album">
         <img id="play-image-album" src="assets/images/default.jpg" />
      </span>
    </div>
    
    <div class="audio-file">
       <p>Reproduciendo</p>
       <span id="play-song-title">
         {{musica.nombre}}       
       </span>
       |
      <!-- <span *ngIf="musica.album['artista']" id="play-song-artista">
         {{musica.album['artista'].nombre}}       
       </span> -->
       <audio controls id="player">
         <source id="mp3-source" src="{{url + 'get-musica-file/'+musica.file}}" type="audio/mpeg" />
         Tu navegador no es compatible
       </audio>
    </div>

  `
})

export class ReproductorComponent implements OnInit {
  public url: string;
  public musica: Musica;

  constructor() {
    this.url = GLOBAL.url;
    this.musica = new Musica('', '', 0, 0, '', '');
  }

  ngOnInit(): void {
    console.log('Reproductor cargado');

    var music = localStorage.getItem('musica_actual');
    if(music){
      this.musica = JSON.parse(music);
    }
  }
}