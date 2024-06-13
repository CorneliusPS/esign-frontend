import {Component, HostListener} from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../../service/auth.service";
import {ISignin} from "../../../interfaces/interfaces-auth/i-signin";
import {ISignInError} from "../../../interfaces/interfaces-auth/i-signin-error";
import {catchError, filter, throwError} from "rxjs";
import {HttpErrorResponse} from "@angular/common/http";
import {ISignInResponse} from "../../../interfaces/interfaces-auth/i-signin-response";
import {MessageService} from "primeng/api";
import {NavigationEnd, Router} from "@angular/router";
import {finalize} from "rxjs/operators";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['login.component.css'],
    providers: [MessageService],
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent {
  valCheck: string[] = ['remember'];

  progressSpinnerVisible: boolean = false;

  user: ISignin | undefined;

  error: ISignInError;

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

    // password!: string;

    constructor(public layoutService: LayoutService, private formBuilder: FormBuilder, private authService: AuthService, private messageService: MessageService, private router: Router) {
      this.error = {
        status: false,
        message: '',
        timestamp: 0
      }
    }

  // You can use this in HTML end just call it like this email.invalid || email.dirty dll
  // get email() {
  //     return this.loginForm.controls['email']
  // }
  //
  // get password() {
  //   return this.loginForm.controls['password']
  // }

  @HostListener('document:keypress', ['$event'])
  handleEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.loginUser(); // Simulate button click
    }
  }

  loginUser() {
    console.log('here')
    this.progressSpinnerVisible = true;
    if (this.loginForm.valid ) {
      this.user = {
        username: this.loginForm.get('username')?.value as string,
        password: this.loginForm.get('password')?.value as string
      }
      this.authService.signIn(this.user).pipe(catchError((error: HttpErrorResponse) => {
        this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Login Failed', life: 3000 });
        this.error = {
          status: true,
          message: error.error.message,
          timestamp: error.error.timestamp
        }
        return throwError(() => new Error('Error login'))
      }),
        finalize(() => {
          this.progressSpinnerVisible = false;
        })
      )
        .subscribe((response: ISignInResponse) => {
          console.log(this.user)
          console.log(response)
          console.log(response.data.akses.namaAkses)
          if (response.data.akses.namaAkses == "superadmin" || response.data.akses.namaAkses == "admin") {
            this.authService.setAuth(response.data.token);
            this.authService.setRole(response.data.akses.namaAkses)
            this.router.navigate(['/admin/dashboard'])
          } else if (response.data.akses.namaAkses == "customer") {
            this.authService.setAuth(response.data.token);
            this.authService.setRole(response.data.akses.namaAkses)
            this.router.navigate(['/'])
          }
          else {
            this.messageService.add({ severity: 'error', summary: 'Failed', detail: 'Login Failed', life: 3000 });
          }
        })
    }
  }



  protected readonly onsubmit = onsubmit;
}
