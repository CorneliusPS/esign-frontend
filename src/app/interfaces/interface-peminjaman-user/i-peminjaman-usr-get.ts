import {IBarang} from "../interfaces-barang/i-barang";

export interface IPeminjamanUsrGet {
  idPeminjamanBarang: number;
  tanggalPeminjaman: Date;
  tanggalPengambilan: Date;
  statusPeminjaman: string;
  jumlahPeminjaman: number;
  catatanAdmin: string;
  ltBarang: IBarang[];
}
