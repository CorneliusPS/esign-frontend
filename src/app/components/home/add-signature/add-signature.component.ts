import { AuthService } from 'src/app/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApprovalService } from 'src/app/service/approval.service';
import { IError } from 'src/app/interfaces/i-error';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import {
  FreeTextEditorAnnotation,
  NgxExtendedPdfViewerService,
} from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-add-signature',
  templateUrl: './add-signature.component.html',
  styleUrls: ['./add-signature.component.scss'],
  providers: [MessageService],
})
export class AddSignatureComponent implements OnInit {
  idApprover: string = '';
  error: IError = this.initializeError();
  data: any;
  pdfSrc: any;
  modifPdf: Blob | null = null;
  annotationEditor: any;
  blob: any;
  otpModal: boolean = false;
  otp: string[] = ['', '', '', '', '', '']; // Sesuaikan panjang OTP
  otpControls: any[] = new Array(this.otp.length);
  progressSpinnerVisible: boolean = false;
  email: string = '';
  maskedEmail: string = '';
  otpCountdown: number = 0; // countdown timer
  otpTimer: any; // reference to the timer
  isApproving: boolean = false; // Flag untuk menangani persetujuan bersamaan

  @Output() otpChange: EventEmitter<string> = new EventEmitter<string>();

  constructor(
    private authService: AuthService,
    private approvalService: ApprovalService,
    private activatedRoute: ActivatedRoute,
    public sanitizer: DomSanitizer,
    private messageService: MessageService,
    private router: Router,
    private pdfViewerService: NgxExtendedPdfViewerService
  ) {}

  ngOnInit(): void {
    this.idApprover = this.activatedRoute.snapshot.paramMap.get('id')!;
    //get email from local storage
    this.loadDocument(Number(this.idApprover));
  }

  loadDocument(idApprover: number): void {
    this.approvalService
      .getOneApprover(idApprover)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
          return throwError(() => new Error('Error fetching'));
        })
      )
      .subscribe((response: any) => {
        this.data = response.data;
        console.log(this.data);
        this.loadPdf(this.data.document.fileData);
      });
  }

  loadPdf(pdfData: string): void {
    try {
      const sanitizedPdfData = this.sanitizeBase64(pdfData);
      const blob = this.convertBase64ToBlob(
        sanitizedPdfData,
        'application/pdf'
      );
      this.pdfSrc = URL.createObjectURL(blob);
    } catch (error) {
      {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: this.error.message,
        });
      }
    }
  }

  sanitizeBase64(base64: string): string {
    return base64.replace(/[^A-Za-z0-9+/=]/g, '');
  }

  convertBase64ToBlob(base64: string, type: string): Blob {
    const byteCharacters = atob(base64);
    const byteNumbers = Array.from(byteCharacters, (char) =>
      char.charCodeAt(0)
    );
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type });
  }

  capturePdfChanges(): void {
    if (this.annotationEditor) {
      this.annotationEditor.save().then((pdfDocument: any) => {
        pdfDocument.getData().then((data: any) => {
          this.modifPdf = new Blob([data], { type: 'application/pdf' });
        });
      });
    }
  }

  sendPdfToServer(file: File): void {
    const formData = new FormData();
    formData.append('signatureData', file);

    this.approvalService
      .signDocument(this.data.document.idDocument, formData)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
          return throwError(() => new Error('Error sending pdf to server'));
        })
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Document signed successfully',
        });

        // Menambahkan setTimeout untuk menunda navigasi
        setTimeout(() => {
          this.router.navigate(['/home/approvalsignature']);
        }, 1000);
      });
  }

  saveApproval(): void {
    if (this.blob) {
      const file = new File([this.blob], 'modifiedDocument.pdf', {
        type: 'application/pdf',
      });
      this.sendPdfToServer(file);
    } else {
      console.log('No changes to save');
    }
  }

  public async export(): Promise<void> {
    this.blob = await this.pdfViewerService.getCurrentDocumentAsBlob();
    this.saveApproval();
  }

  goBack() {
    this.router.navigate(['/home/approvalsignature']);
  }

  private initializeError(): IError {
    return {
      status: false,
      message: '',
      timestamp: 0,
    };
  }

  showModal(): void {
    if (this.otpCountdown > 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: `Tunggu ${this.otpCountdown} detik untuk mengirim ulang OTP`,
      });
    } else {
      this.sendOtp();
    }
    this.maskedEmail = this.maskEmail(this.email);
    this.otpModal = true;
  }

  hideModal(): void {
    if (this.isApproving) {
      return; // Mencegah persetujuan ganda
    }
    this.isApproving = true; // Mengatur flag menjadi true untuk menandakan proses persetujuan sedang berlangsung

    this.progressSpinnerVisible = true;
    const otpNumber = this.otp.toString().replaceAll(',', '');

    const data = {
      otp: otpNumber,
    };

    this.approvalService
      .verifOtp(Number(this.idApprover), data)
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
          this.progressSpinnerVisible = false;
          return throwError(() => new Error('Error fetching'));
        })
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'OTP berhasil dikirimkan',
        });

        if (
          this.data.document.numberOfApprovers === this.data.document.flagCount
        ) {
          this.addTextEditor();
        }

        this.otpModal = false;
        this.email = '';
        this.maskedEmail = '';
        setTimeout(() => {
          this.export();
        }, 500);
      })
      .add(() => {
        this.isApproving = false; // Mengatur flag menjadi false setelah proses persetujuan selesai
      });
  }

  onInput(event: any, index: number): void {
    const input = event.target.value;
    if (/^[0-9]$/.test(input)) {
      if (index < this.otp.length - 1) {
        (event.target.nextElementSibling as HTMLInputElement).focus();
      }
    } else {
      event.target.value = '';
    }
    this.otp[index] = input;
    this.otpChange.emit(this.otp.join(''));
  }

  onBackspace(event: any, index: number): void {
    if (event.key === 'Backspace' && index > 0 && !this.otp[index]) {
      (event.target.previousElementSibling as HTMLInputElement).focus();
    }
  }

  private startOtpCountdown(): void {
    this.otpCountdown = 60; // set countdown to 60 seconds
    this.otpTimer = setInterval(() => {
      this.otpCountdown--;
      if (this.otpCountdown <= 0) {
        clearInterval(this.otpTimer);
      }
    }, 1000);
  }

  sendOtp(): void {
    this.email = this.authService.getEmail();
    this.maskedEmail = this.maskEmail(this.email);
    this.approvalService
      .sendOtp(Number(this.idApprover))
      .pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error.message,
          });
          return throwError(() => new Error('Error fetching'));
        })
      )
      .subscribe((response: any) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'OTP sent successfully',
        });
        this.startOtpCountdown();
      });
  }

  maskEmail(email: string): string {
    const [localPart, domain] = email.split('@');
    const visibleStart = localPart.slice(0, 3);
    const visibleEnd = localPart.slice(-2);
    const maskedPart =
      localPart.length > 5 ? '*'.repeat(localPart.length - 5) : '';
    return `${visibleStart}${maskedPart}${visibleEnd}@${domain}`;
  }

  public addTextEditor(): void {
    const textEditorAnnotation: FreeTextEditorAnnotation = {
      annotationType: 3,
      color: [0, 0, 0],
      fontSize: 16,
      value: `ID Doc: ${this.data.document.documentSign}`,
      pageIndex: this.pdfViewerService.numberOfPages() - 1,

      rect: [
        50, // height?
        0, // y
        590, // x
        600, // width?
      ],
      rotation: 270,
    };

    this.pdfViewerService.addEditorAnnotation(textEditorAnnotation);
  }
}
