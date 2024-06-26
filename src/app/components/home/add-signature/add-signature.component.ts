import { AuthService } from 'src/app/service/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ApprovalService } from 'src/app/service/approval.service';
import { IError } from 'src/app/interfaces/i-error';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-add-signature',
  templateUrl: './add-signature.component.html',
  styleUrls: ['./add-signature.component.scss'],
  providers: [MessageService],
})
export class AddSignatureComponent implements OnInit {
  idApprover: string = '';
  error: IError = this.initializeError();
  document: any;
  pdfSrc: any;
  modifPdf: Blob | null = null;
  annotationEditor: any;
  blob: any;
  displayModal: boolean = false;
  otp: string[] = ['', '', '', '', '', '']; // Sesuaikan panjang OTP
  otpControls: any[] = new Array(this.otp.length);

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
    this.loadDocument(Number(this.idApprover));
  }

  loadDocument(idApprover: number): void {
    this.approvalService
      .getOneApprover(idApprover)
      .pipe(catchError((error) => this.handleHttpError(error)))
      .subscribe((response: any) => {
        this.document = response.data;
        this.loadPdf(this.document.document.fileData);
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
      this.handleError('Failed to load PDF', this.error.message);
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

  onAnnotationEditorCreated(event: any): void {
    this.annotationEditor = event;
    this.annotationEditor.addEventListener(
      'annotationAdded',
      this.capturePdfChanges.bind(this)
    );
    this.annotationEditor.addEventListener(
      'annotationRemoved',
      this.capturePdfChanges.bind(this)
    );
    this.annotationEditor.addEventListener(
      'annotationUpdated',
      this.capturePdfChanges.bind(this)
    );
  }

  onAnnotationEditorDestroyed(): void {
    if (this.annotationEditor) {
      this.annotationEditor.removeEventListener(
        'annotationAdded',
        this.capturePdfChanges.bind(this)
      );
      this.annotationEditor.removeEventListener(
        'annotationRemoved',
        this.capturePdfChanges.bind(this)
      );
      this.annotationEditor.removeEventListener(
        'annotationUpdated',
        this.capturePdfChanges.bind(this)
      );
      this.annotationEditor = null;
    }
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
      .signDocument(this.document.document.idDocument, formData)
      .pipe(catchError((error) => this.handleHttpError(error)))
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

  handleHttpError(error: HttpErrorResponse) {
    this.error = {
      status: true,
      message: error.message,
      timestamp: Date.now(),
    };
    if (error.status === 401) {
      this.authService.logout();
    }
    return throwError(() => new Error('Error fetching'));
  }

  private handleError(message: string, detail: string = ''): void {
    this.error = { status: true, message, timestamp: Date.now() };
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `${message}${detail ? `: ${detail}` : ''}`,
    });
  }

  private initializeError(): IError {
    return {
      status: false,
      message: '',
      timestamp: 0,
    };
  }

  showModal(): void {
    this.displayModal = true;
  }

  hideModal(): void {
    this.displayModal = false;
    console.log('OTP', this.otp);

    const result = this.otp.map((i) => Number(i));
    console.log(result);

    this.otp = this.otp.map(() => '');
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
}
