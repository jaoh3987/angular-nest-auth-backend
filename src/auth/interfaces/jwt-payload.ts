
export interface JwtPayload{
    id:string;
    iat?:number;//Fecha de creacion
    exp?:number;//Fecha de expiracion

}