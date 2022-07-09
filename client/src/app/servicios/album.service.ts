import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpRequest } from '@angular/common/http';
import 'rxjs-compat/add/operator/map';
import { GLOBAL } from './global';
import { Album } from '../modelos/album';

@Injectable({
    providedIn: "root"
})
export class AlbumService {
    public url: string;
    public identity;
    public token;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    addAlbum(token, album) {
        let params = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.post(this.url + 'album', params, { headers: headers });
    }

    getAlbum(token, id) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.get(this.url + 'album/' + id, { headers: headers })
    }

    update_album(token, id, album) {
        let params = JSON.stringify(album);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.put(this.url + 'album/' + id, params, { headers: headers });
    }

    getAlbums(token, artistId) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        if (artistId == null) {
            return this._http.get(this.url + 'albums/', { headers: headers })
        } else {
            return this._http.get(this.url + 'albums/' + artistId, { headers: headers })
        }

    }

    delete_album(token, id) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.delete(this.url + 'album/' + id, { headers: headers });
    }



    ////////////////////////// Para usar el token sin necesidad de recibirlo por el metodo
    /*  getToken() {
          let token = localStorage.getItem('token');
          if (token != "undefined") {
              this.token = token;
          } else {
              this.token = null;
          }
          return this.token;
      }
     */
}