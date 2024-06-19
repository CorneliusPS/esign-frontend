import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { IError } from 'src/app/interfaces/i-error';
import { IResponseList } from 'src/app/interfaces/i-response-list';
import { IDocumentPost } from 'src/app/interfaces/interface-document/i-document-post';
import { ApprovalService } from 'src/app/service/approval.service';
import { AuthService } from 'src/app/service/auth.service';
import { DocumentService } from 'src/app/service/document.service';
import { UserService } from 'src/app/service/user.service';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { SignaturePadComponent } from '@almothafar/angular-signature-pad';

@Component({
  selector: 'app-approval-signature',
  templateUrl: './approval-signature.component.html',
  styleUrls: ['./approval-signature.component.scss'],
  providers: [MessageService],
})
export class ApprovalSignatureComponent implements OnInit {
  @ViewChild(SignaturePadComponent) signaturePad!: SignaturePadComponent;

  approvers: any[] = [];
  documentName: string = '';
  filteredApprovers: any[] = [];
  selectedApprovers: any[] = [];
  selectedApprover: any = {};
  uploadForm: FormGroup | undefined;
  documents: any[] = [];
  selectedDocuments: any[] = [];
  approvalDialog: boolean = false;
  deleteDocumentDialog: boolean = false;
  document: any = {};
  submitted: boolean = false;
  distributionType: string = '';
  error: IError = {
    status: false,
    message: '',
    timestamp: 0,
  };
  postDocument: IDocumentPost = {};
  oneDocument: any;
  file: any;
  distributionOptions = [
    { label: 'Parallel', value: 'parallel' },
    { label: 'Serial', value: 'serial' },
  ];

  signaturePadOptions: any = {
    minWidth: 1,
    canvasWidth: 500,
    canvasHeight: 300,
  };

  constructor(
    private documentService: DocumentService,
    private messageService: MessageService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private userService: UserService,
    private approvalService: ApprovalService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.approvalService
      .getAllAprover()
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
        this.documents = response.data;
        console.log(this.documents);
      });
  }

  onUpload(event: any): void {
    this.file = event.target.files[0];
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.postDocument.fileData = e.target.result.split(',')[1];
      };
      reader.readAsDataURL(this.file);
    }
  }

  getOneDocument(idDocument: number) {
    this.approvalService
      .getOneDocument(idDocument)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error = {
            status: true,
            message: error.message,
            timestamp: Date.now(),
          };
          if (error.status == 401) {
            this.authService.logout();
          }
          return throwError(() => new Error('Error fetching approvers'));
        })
      )
      .subscribe((response: any) => {
        this.oneDocument = response.data;
      });

    this.postDocument = {};
    this.submitted = false;
    this.approvalDialog = true;
  }

  openNew(): void {
    this.postDocument = {};
    this.submitted = false;
    this.approvalDialog = true;
    this.selectedApprovers = [];
  }

  hideDialog(): void {
    this.approvalDialog = false;
    this.submitted = false;
    this.postDocument = {};
    this.signaturePad.clear();
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

  clearSignature(): void {
    this.signaturePad.clear();
  }

  async addSignature(): Promise<void> {
    if (!this.oneDocument.fileData || this.signaturePad.isEmpty()) return;

    const signatureDataUrl = this.signaturePad.toDataURL('image/png');
    const signatureImageBytes = Uint8Array.from(
      atob(signatureDataUrl.split(',')[1]),
      (c) => c.charCodeAt(0)
    );

    const pdfBytes = Uint8Array.from(atob(this.oneDocument.fileData), (c) =>
      c.charCodeAt(0)
    );

    const pdfDoc = await PDFDocument.load(pdfBytes);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    const { width, height } = firstPage.getSize();
    const signatureImageDims = signatureImage.scale(0.25);

    firstPage.drawImage(signatureImage, {
      x: width - signatureImageDims.width - 50,
      y: height - signatureImageDims.height - 50,
      width: signatureImageDims.width,
      height: signatureImageDims.height,
    });

    const modifiedPdfBytes = await pdfDoc.save();
    this.oneDocument.fileData = btoa(
      String.fromCharCode(...new Uint8Array(modifiedPdfBytes))
    );
  }
}
