import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'welcome',
        data: { breadcrumb: 'Home' },
        loadChildren: () =>
          import('./welcome/welcome.module').then((m) => m.WelcomeModule),
      },
      {
        path: 'welcome-detail-pinjam/:id',
        loadChildren: () =>
          import(
            './welcomepeminjamandetail/welcomepeminjamandetail.module'
          ).then((m) => m.WelcomepeminjamandetailModule),
      },
      {
        path: 'welcome-detail-permintaan/:id',
        loadChildren: () =>
          import(
            './welcomepermintaandetail/welcomepermintaandetail.module'
          ).then((m) => m.WelcomepermintaandetailModule),
      },
      {
        path: 'pinjambarang',
        data: { breadcrumb: 'Peminjaman Barang' },
        loadChildren: () =>
          import('./pinjambarang/pinjambarang.module').then(
            (m) => m.PinjambarangModule
          ),
      },
      {
        path: 'permintaanbarang',
        data: { breadcrumb: 'Permintaan Barang' },
        loadChildren: () =>
          import('./mintabarang/mintabarang.module').then(
            (m) => m.MintabarangModule
          ),
      },
      {
        path: 'requestsignature',
        data: { breadcrumb: 'Request Signature' },
        loadChildren: () =>
          import('./request-signature/request-signature.module').then(
            (m) => m.RequestSignatureModule
          ),
      },
      { path: '**', redirectTo: '/notfound' },
    ]),
  ],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
