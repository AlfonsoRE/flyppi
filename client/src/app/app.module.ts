import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import {routing} from './app-routing';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { UserEditComponent } from './components/user-edit.component';
import { ArtistaListaComponent } from './components/artista-lista.component';
import { HomeComponent } from './components/home.component';
import { ArtistaAddComponent } from './components/artista-add.component';
import { ArtistaEditarComponent } from './components/artista-editar.component';
import { ArtistaDetalleComponent } from './components/artista-detalle.component';
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditarComponent } from './components/album-editar.component';
import { AlbumDetalleComponent } from './components/album-detalle.component';
import { MusicaAddComponent } from './components/musica-add.component';
import { MusicaEditarComponent } from './components/musica-editar.component';
import { ReproductorComponent } from './components/reproductor.component';



@NgModule({
  declarations: [
    AppComponent,
    UserEditComponent,
    ArtistaListaComponent,
    HomeComponent,
    ArtistaAddComponent,
    ArtistaEditarComponent,
    ArtistaDetalleComponent,
    AlbumAddComponent,
    AlbumEditarComponent,
    AlbumDetalleComponent,
    MusicaAddComponent,
    MusicaEditarComponent,
    ReproductorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    routing
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
