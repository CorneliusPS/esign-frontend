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
import {ISignup} from "../../../interfaces/interfaces-auth/i-signup";
import {ISignupError} from "../../../interfaces/interfaces-auth/i-signup-error";
import Swal from "sweetalert2";
import {finalize} from "rxjs/operators";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['register.component.css'],
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
export class RegisterComponent {
  valCheck: string[] = ['remember'];

  progressSpinnerVisible: boolean = false;

  user: ISignup | undefined;

  error: ISignupError;

  registerForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.pattern('^[a-z]{7,15}$')]],
    email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_!#$%&\'*+/=?`{|}~^.-]+@[a-zA-Z0-9.-]+$')]],
    noHp: ['', [Validators.required, Validators.pattern('^(0|62|\\+62)\\d{9,15}$')]],
    tanggalLahir: [new Date(), [Validators.required]],
    password: ['', [Validators.required, Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[_#\\-$])(?!.*?[^A-Za-z0-9_#\\-$]).{8,}$')]],
    alamat: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ]{30,255}$')]],
    namaLengkap: ['', [Validators.required, Validators.pattern('^[a-z ]{6,15}$')]],
  });

    constructor(public layoutService: LayoutService, private formBuilder: FormBuilder, private authService: AuthService, private messageService: MessageService, private router: Router) {
      this.error = {
        status: false,
        message: '',
        timestamp: 0
      }
    }


  // @HostListener('document:keypress', ['$event'])
  // handleEnterKey(event: KeyboardEvent) {
  //   if (event.key === 'Enter') {
  //     this.registerUser(); // Simulate button click
  //   }
  // }

  registerUser() {
    this.progressSpinnerVisible = true;
    if (this.registerForm.valid ) {
      this.user = {
        username: this.registerForm.get('username')?.value as string,
        email: this.registerForm.get('email')?.value as string,
        noHp: this.registerForm.get('noHp')?.value as string,
        tanggalLahir: this.registerForm.get('tanggalLahir')?.value as Date,
        password: this.registerForm.get('password')?.value as string,
        alamat: this.registerForm.get('alamat')?.value as string,
        namaLengkap: this.registerForm.get('namaLengkap')?.value as string,
      }
      this.authService.signUp(this.user).pipe(catchError((error: HttpErrorResponse) => {
        this.error = {
          status: true,
          message: error.error.message,
          timestamp: error.error.timestamp
        }
        Swal.fire({
          icon: "error",
          title: "Registrasi akun gagal",
          showConfirmButton: true,
          timer: 3000
        })
        return throwError(() => new Error('Error register'))
      }),
        finalize(() => {
          this.progressSpinnerVisible = false;
        })
      )
        .subscribe((response: ISignInResponse) => {
            console.log("Masuk sini")
            Swal.fire({
              icon: "success",
              title: "Registrasi akun berhasil",
              showConfirmButton: true,
              timer: 3000
            }).then(() => {
              this.registerForm.reset();
              this.router.navigate(["/auth/login"])
            })
        })
    }
  }



  protected readonly onsubmit = onsubmit;
}
