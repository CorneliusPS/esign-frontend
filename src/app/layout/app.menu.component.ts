import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { AuthService } from '../service/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(
    public layoutService: LayoutService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    if (this.authService.isAdminLoggedIn()) {
      this.model = [
        {
          label: 'Dashboard',
          items: [
            {
              label: 'Dashboard',
              icon: 'pi pi-fw pi-home',
              routerLink: ['/admin/dashboard'],
            },
          ],
        },
        {
          label: 'Management Barang',
          items: [
            {
              label: 'Kategori Barang',
              icon: 'pi pi-fw pi-hashtag',
              routerLink: ['/admin/inventory/kategoribarang'],
            },
            {
              label: 'Barang',
              icon: 'pi pi-fw pi-box',
              routerLink: ['/admin/inventory/barang'],
            },
          ],
        },
        {
          label: 'Management Peminjaman',
          items: [
            {
              label: 'Peminjaman Barang',
              icon: 'pi pi-fw pi-inbox',
              routerLink: ['/admin/inventory/peminjamanbarang'],
              badge: 'NEW',
            },
          ],
        },
        {
          label: 'Management Permintaan',
          items: [
            {
              label: 'Permintaan Barang',
              icon: 'pi pi-fw pi-send',
              routerLink: ['/admin/inventory/permintaanbarang'],
              badge: 'NEW',
            },
          ],
        },
      ];
    } else if (this.authService.isCustomerLoggedIn()) {
      this.model = [
        {
          label: 'Home',
          items: [
            {
              label: 'Home',
              icon: 'pi pi-fw pi-home',
              routerLink: ['/home/welcome'],
            },
          ],
        },
        {
          label: 'Request',
          items: [
            {
              label: 'Request Signature',
              icon: 'pi pi-fw pi-upload',
              routerLink: ['/home/requestsignature'],
            },
          ],
        },
        {
          label: 'Approval',
          items: [
            {
              label: 'List Request Approval',
              icon: 'pi pi-fw pi-inbox',
              routerLink: ['/home/approvalsignature'],
            },
            {
              label: 'Approve Document',
              icon: 'pi pi-fw pi-file-edit',
              routerLink: ['/home/requestsignature'],
            },
          ],
        },
      ];
    }
  }
}
