import { Component, OnInit } from "@angular/core";
import { UserService } from "../servicios/user.service";
import { Usuario } from "../modelos/usuario";
import { GLOBAL } from "../servicios/global";

@Component({
    selector: 'user-edit',
    templateUrl: '../views/user-edit.html',
    providers: [UserService]
})
export class UserEditComponent implements OnInit {
    public titulo: string;
    public user: Usuario;
    public identity;
    public token;
    public alertMessage;
    public url: string;

    constructor(private _userService: UserService) {
        this.titulo = "Actualizar Usuario";
        //LocalStorage
        this.identity = this._userService.getIdentity();
        this.token = this._userService.getToken();
        this.user = this._userService.identity;
        this.url = GLOBAL.url;
    }

    ngOnInit(): void {
        console.log('user-edit.component.ts cargado');
    }
    onSubmit() {

        this._userService.update_user(this.user).subscribe(
            response => {
                if (!response['user']) {
                    this.alertMessage = "El usuario no se ha actualizado";
                } else {
                     // this.user = response['user'];
                     localStorage.setItem('identity', JSON.stringify(this.user));
                     document.getElementById("identity_name")!.innerHTML = this.user.nombre;
                    
                    if(!this.filesToUpload){
                        //Para subir la imagen

                    }else{
                        this.makeFileRequest(this.url+'upload-image-user/'+this.user._id,[],this.filesToUpload).then(
                            (result: any) => {
                                this.user.imagen = result.image;
                                localStorage.setItem('identity', JSON.stringify(this.user));
                                let ip = this.url+'get-image-user/'+this.user.imagen;
                                document.getElementById("image-logged")!.setAttribute('src',ip);            
                            }
                        );
                    }
                    
                    this.alertMessage = "El usuario se ha actualizado correctamente";
                }
            },
            error => {
                var errorMessage = <any>error;
                if (errorMessage != null) {
                    this.alertMessage = error.error.message;
                }
            }
        );
    }

    public filesToUpload: Array<File>;

    fileChangeEvent(fileInput: any) {
        this.filesToUpload = <Array<File>>fileInput.target.files;
    }

    makeFileRequest(url: string, params: Array<string>,files:Array<File>){
        var token = this.token;
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
