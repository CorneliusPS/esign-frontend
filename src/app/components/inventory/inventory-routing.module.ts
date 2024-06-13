import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
      { path: 'kategoribarang', data: { breadcrumb: 'Kategori Barang' }, loadChildren: () => import('./kategoribarang/kategoribarang.module').then(m => m.KategoribarangModule) },
      { path: 'barang', data: { breadcrumb: 'Barang' }, loadChildren: () => import('./barang/barang.module').then(m => m.BarangModule) },
      { path: 'peminjamanbarang', data: { breadcrumb: 'Peminjaman Barang' }, loadChildren: () => import('./peminjamanbarang/peminjamanbarang.module').then(m => m.PeminjamanbarangModule) },
      { path: 'permintaanbarang', data: { breadcrumb: 'Permintaan Barang' }, loadChildren: () => import('./permintaanbarang/permintaanbarang.module').then(m => m.PermintaanbarangModule) },
      { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class InventoryRoutingModule { }
