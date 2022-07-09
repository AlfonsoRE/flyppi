import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse,HttpRequest } from '@angular/common/http';
import 'rxjs-compat/add/operator/map';
import { GLOBAL } from './global';

@Injectable({
    providedIn: "root"
})
export class ArtistaService {
    public url: string;
    public identity;
    public token;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    addArtista(token, artista_register) {
        let params = JSON.stringify(artista_register);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.post(this.url + 'artista', params, { headers: headers });
    }

    getArtistas(token, page){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

      //  let options = new HttpRequest({ headers: headers });
        return this._http.get(this.url+'artistas/'+page, { headers: headers })
    }

    
    getArtista(token, id: string){
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

      //  let options = new HttpRequest({ headers: headers });
        return this._http.get(this.url+'artista/'+id, { headers: headers })
    }

    update_artista(token, id:string, user_update) {
        let params = JSON.stringify(user_update);
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.put(this.url + 'artista/' + id, params, { headers: headers });
    }

    delete_artista(token, id:string) {
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token
        });

        return this._http.delete(this.url + 'artista/' + id, { headers: headers });
    }



    //////////////////////////

    signup(user_to_login, gethash) {
        if (gethash != null) {
            user_to_login.gethash = gethash;
        }
        let json = JSON.stringify(user_to_login);
        let params = json;
        let headers = new HttpHeaders({ 'Content-Type': 'application/json' });

        return this._http.post(this.url + 'login', params, { headers: headers });
    }
    getIdentity() {
        let identity = JSON.parse(localStorage.getItem('identity') || '');
        if (identity != "undefined") {
            this.identity = identity;
        } else {
            this.identity = null;
        }
        return this.identity;
    }
    getToken() {
        let token = localStorage.getItem('token');
        if (token != "undefined") {
            this.token = token;
        } else {
            this.token = null;
        }
        return this.token;
    }
   
}