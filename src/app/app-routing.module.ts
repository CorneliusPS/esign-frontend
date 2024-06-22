import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { AuthGuard, PreventGuard } from './guards/auth.guard';
@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'auth',
          loadChildren: () =>
            import('./components/auth/auth.module').then((m) => m.AuthModule),
          canActivate: [PreventGuard],
        },
        {
          path: '',
          component: AppLayoutComponent,
          canActivate: [AuthGuard],
          children: [
            {
              path: 'home',
              loadChildren: () =>
                import('./components/home/home.module').then(
                  (m) => m.HomeModule
                ),
              canActivate: [AuthGuard],
            },
          ],
        },
        {
          path: 'admin',
          component: AppLayoutComponent,
          canActivate: [AuthGuard],
          children: [
            {
              path: 'dashboard',
              loadChildren: () =>
                import('./components/dashboard/dashboard.module').then(
                  (m) => m.DashboardModule
                ),
              canActivate: [AuthGuard],
            },
            {
              path: 'inventory',
              loadChildren: () =>
                import('./components/inventory/inventory.module').then(
                  (m) => m.InventoryModule
                ),
              canActivate: [AuthGuard],
            },
          ],
        },
        { path: 'notfound', component: NotfoundComponent },
        { path: '**', redirectTo: '/notfound' },
      ],
      {
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
        onSameUrlNavigation: 'reload',
      }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
