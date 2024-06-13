import {IKategori} from "../interfaces-kategori/i-kategori";

export interface IBarangPost {
  idBarang?: string;
  kodeBarang?:string;
  namaBarang?:string;
  hargaBarang?:number;
  stokBarang?:number;
  statusBarang?:string;
  imageBarang?:File;
  deskripsiBarang?:string;
  kategoriBarang?: { namaKategori: string, idKategori: string }; // Update this line
}
