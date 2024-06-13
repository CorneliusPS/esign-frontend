import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterRoutingModule } from './register-routing.module';
import { RegisterComponent } from './register.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import {ToastModule} from "primeng/toast";
import {CalendarModule} from "primeng/calendar";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@NgModule({
  imports: [
    CommonModule,
    RegisterRoutingModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormsModule,
    PasswordModule,
    ReactiveFormsModule,
    ToastModule,
    CalendarModule,
    ProgressSpinnerModule
  ],
    declarations: [RegisterComponent]
})
export class RegisterModule { }
