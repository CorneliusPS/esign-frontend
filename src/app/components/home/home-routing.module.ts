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
        path: 'approvalsignature',
        data: { breadcrumb: 'Approval Signature' },
        loadChildren: () =>
          import('./approval-signature/approval-signature.module').then(
            (m) => m.ApprovalSignatureModule
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
      {
        path: 'add-signature/:id',
        loadChildren: () =>
          import('./add-signature/add-signature.module').then(
            (m) => m.AddSignatureModule
          ),
      },
      { path: '**', redirectTo: '/notfound' },
    ]),
  ],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
