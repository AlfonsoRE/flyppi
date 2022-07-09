export class Musica{
    constructor(
        public _id: string,
        public nombre: string,
        public numero: number,
        public duracion: number,
        public file: string,
        public album: string
    ){}
}