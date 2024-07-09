import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { IError } from 'src/app/interfaces/i-error';
import { IResponseList } from 'src/app/interfaces/i-response-list';
import { IDocumentPost } from 'src/app/interfaces/interface-document/i-document-post';
import { ApprovalService } from 'src/app/service/approval.service';
import { AuthService } from 'src/app/service/auth.service';
import { PDFDocument } from 'pdf-lib';
import { SignaturePadComponent } from '@almothafar/angular-signature-pad';
import { Router } from '@angular/router';
import { DocumentService } from 'src/app/service/document.service';

@Component({
  selector: 'app-document-signed',
  templateUrl: './document-signed.component.html',
  styleUrls: ['./document-signed.component.scss'],
  providers: [MessageService],
})
export class DocumentSignedComponent implements OnInit {
  datas: any[] = [];
  error: IError = {
    status: false,
    message: '',
    timestamp: 0,
  };
  pdfSrc: any;

  pdfDialog: boolean = false;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private documentService: DocumentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.documentService
      .getAllDocumentSigned()
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error = {
            status: true,
            message: error.message,
            timestamp: Date.now(),
          };
          if (error.status == 401) {
            this.authService.logout();
          } else if (error.status == 404) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'No documents found',
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: this.error.message,
            });
          }
          return throwError(() => new Error('Error fetching documents'));
        })
      )
      .subscribe((response: IResponseList) => {
        this.datas = response.data;
        console.log(this.datas);
      });
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

  openPdfViewer(document: any): void {
    this.loadPdf(document.fileData);
    this.pdfDialog = true;
  }

  hidePdfDialog(): void {
    this.pdfDialog = false;
    this.pdfSrc = null;
  }

  onGlobalFilter(event: Event, dt: any): void {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  getStatusBadgeClass(status: boolean): string {
    switch (status) {
      case true:
        return 'product-badge status-instock';
      case false:
        return 'product-badge status-outofstock';
      default:
        return '';
    }
  }
  goToPageSignature(idApprover: number) {
    this.router.navigate(['/home/add-signature', idApprover]);
  }

  private handleError(message: string, detail: string = ''): void {
    this.error = { status: true, message, timestamp: Date.now() };
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: `${message}${detail ? `: ${detail}` : ''}`,
    });
  }
}
