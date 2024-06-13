import {IBarang} from "../interfaces-barang/i-barang";

interface User {
  email?: string;
  noHp?: string;
}

interface Barang {
  kodeBarang?: string;
  namaBarang?: string;
  imageBarang?: string;
}

export interface IPeminjamanBarang {
  idPeminjamanBarang?: number;
  tanggalPeminjaman?: number;
  tanggalPengambilan?: number;
  statusPeminjaman?: string;
  jumlahPeminjaman?: number;
  catatanAdmin?: string;
  user?: User;
  ltBarang?: IBarang[];
}
