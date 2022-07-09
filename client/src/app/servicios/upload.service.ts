import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse,HttpRequest } from '@angular/common/http';
import 'rxjs-compat/add/operator/map';
import { GLOBAL } from './global';

@Injectable({
    providedIn: "root"
})
export class UploadService {
    public url: string;

    constructor(private _http: HttpClient) {
        this.url = GLOBAL.url;
    }

    makeFileRequest(url: string, params: Array<string>,files:Array<File>, token){
        
        return new Promise( function(resolve, reject){
            var formData:any = new FormData();
            var xhr = new XMLHttpRequest();
            for(var i=0;i<files.length;i++){
                formData.append('imagen',files[i],files[i].name);
            }
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){
                    if(xhr.status==200){
                        resolve(JSON.parse(xhr.response));
                    }else{
                        reject(xhr.response);
                    }
                }                
            }
            xhr.open('POST',url,true);
            xhr.setRequestHeader('Authorization',token);
            xhr.send(formData);            
        });
    }


}