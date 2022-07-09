import { ModuleWithProviders } from '@angular/core';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Impor del usuario
import { HomeComponent } from './components/home.component';
import { UserEditComponent } from './components/user-edit.component';
//Impor de artista
import { ArtistaListaComponent } from './components/artista-lista.component';
import { ArtistaAddComponent } from './components/artista-add.component';
import { ArtistaEditarComponent } from './components/artista-editar.component';
import { ArtistaDetalleComponent } from './components/artista-detalle.component';
//import de Album
import { AlbumAddComponent } from './components/album-add.component';
import { AlbumEditarComponent } from './components/album-editar.component';
import { AlbumDetalleComponent } from './components/album-detalle.component';
//Import de Canciones
import { MusicaAddComponent } from './components/musica-add.component';
import { MusicaEditarComponent } from './components/musica-editar.component';





const appRoutes: Routes = [
  {path:'',component: HomeComponent},
  {path:'artistas/:page',component:ArtistaListaComponent},
  {path:'crear-artista',component:ArtistaAddComponent},
  {path:'editar-artista/:id',component:ArtistaEditarComponent},
  {path:'artista/:id',component:ArtistaDetalleComponent},  
  {path:'crear-album/:artista',component:AlbumAddComponent},
  {path:'editar-album/:id',component:AlbumEditarComponent},
  {path:'album/:id',component:AlbumDetalleComponent},
  {path:'crear-cancion/:album',component:MusicaAddComponent},
  {path:'editar-cancion/:id',component:MusicaEditarComponent},
  {path:'mis-datos',component:UserEditComponent},
  {path:'**',component: HomeComponent}
];

//export const appRoutingProviders: any[] = [];
//export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class routing { }
