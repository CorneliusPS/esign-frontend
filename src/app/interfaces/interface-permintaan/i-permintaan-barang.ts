import {PermintaanbarangComponent} from "../../components/inventory/permintaanbarang/permintaanbarang.component";

interface User {
  email?: string;
  noHp?: string;
}

export interface IPermintaanBarang {
  idPermintaanBarang?: number;
  namaBarang?: string;
  deskripsiBarang?: string;
  jumlahPermintaan?: number;
  statusPermintaan?: boolean;
  catatanAdmin?: string;
  tanggalPermintaan?: Date;
  filePermintaan?: string;
  user?: User;
}
