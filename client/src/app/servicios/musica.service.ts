import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs-compat/add/operator/map';
import { GLOBAL } from './global';
import { Musica } from '../modelos/musica';

@Injectable({
    providedIn: "root"
})
export class MusicaService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    addMusica(token, musica) {
        let params = JSON.stringify(musica);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.post(this.url + 'musica', params, { headers: headers });
    }

    getMusica(token, id) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.get(this.url + 'musica/' + id, { headers: headers })
    }

    update_musica(token, id, musica) {
        let params = JSON.stringify(musica);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        return this._http.put(this.url + 'musica/' + id, params, { headers: headers });
    }

    getMusicas(token, id) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });
        if (id == null) {
            return this._http.get(this.url + 'musicas/', { headers: headers })
        } else {
            return this._http.get(this.url + 'musicas/' + id, { headers: headers })
        }

    }

    delete_musica(token, id) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.delete(this.url + 'musica/' + id, { headers: headers });
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