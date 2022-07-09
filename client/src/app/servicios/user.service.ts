import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders,HttpResponse} from '@angular/common/http';
import 'rxjs-compat/add/operator/map'; 
import { Observable } from 'rxjs-compat/Observable';
import {GLOBAL} from './global';

@Injectable({
    providedIn: "root"
  })
export class UserService{
    public url: string;
    public identity;
    public token;

    constructor(private _http: HttpClient){
        this.url = GLOBAL.url;
    }

    signup(user_to_login,gethash){
        if(gethash!=null){
            user_to_login.gethash = gethash;
        }
        let json = JSON.stringify(user_to_login);
        let params = json;
        let headers =  new HttpHeaders({'Content-Type':'application/json'});

        return this._http.post(this.url+'login',params,{headers: headers});
    }
    getIdentity(){
        let identity = JSON.parse(localStorage.getItem('identity') || '');
        if(identity != "undefined"){
            this.identity = identity;
        }else{
            this.identity = null;
        }
        return this.identity;
    }
    getToken(){
        let token = localStorage.getItem('token');
        if(token!="undefined"){
            this.token = token;
        }else{
            this.token=null;
        }
        return this.token;
    }

    register(user_register){
        let params = JSON.stringify(user_register);
        let headers =  new HttpHeaders({'Content-Type':'application/json'});

        return this._http.post(this.url+'registrar',params,{headers: headers});
    }

    update_user(user_update){
        let params = JSON.stringify(user_update);
        let headers =  new HttpHeaders({
            'Content-Type':'application/json',
            'Authorization': this.getToken()
        });

        return this._http.put(this.url+'update-user/'+user_update._id,params,{headers: headers});
    }
}