export class Album{
    constructor(
        public _id: string,
        public titulo: string,
        public descripcion: string,
        public año: number,
        public imagen: string,
        public artista: string
    ){}
}