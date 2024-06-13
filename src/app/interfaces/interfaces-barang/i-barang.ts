import {IKategori} from "../interfaces-kategori/i-kategori";

export interface IBarang {
  idBarang?: string;
  kodeBarang?:string;
  namaBarang?:string;
  imageBarang?:string;
  imageId?:string;
  hargaBarang?:number;
  stokBarang?:number;
  statusBarang?:string;
  deskripsiBarang?:string;
  kategoriBarang?:IKategori;
  createdBy?:String;
  createdDate?:Date;
}
