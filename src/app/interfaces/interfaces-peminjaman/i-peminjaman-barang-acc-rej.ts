import {IBarang} from "../interfaces-barang/i-barang";

export interface IPeminjamanBarangAccRej {
  idPeminjamanBarang?: number;
  catatanAdmin?: string;
  ltBarang?: IBarang[];
}
