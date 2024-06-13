import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import {AuthService} from "../service/auth.service";
import {User} from "../interfaces/auth";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    tieredItems: MenuItem[] = [];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(public layoutService: LayoutService, private authService: AuthService) { }

  logout() {
    this.authService.logout();
  }

  isAdminLoggedIn: boolean = this.authService.isAdminLoggedIn()

  isCustomerLoggedIn: boolean = this.authService.isCustomerLoggedIn()
}
