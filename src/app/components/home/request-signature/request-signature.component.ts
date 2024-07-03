import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';
import { IError } from 'src/app/interfaces/i-error';
import { IResponseList } from 'src/app/interfaces/i-response-list';
import { IDocumentPost } from 'src/app/interfaces/interface-document/i-document-post';
import { AuthService } from 'src/app/service/auth.service';
import { DocumentService } from 'src/app/service/document.service';
import { UserService } from 'src/app/service/user.service';
import { NgxExtendedPdfViewerService } from 'ngx-extended-pdf-viewer';

@Component({
  selector: 'app-request-signature',
  templateUrl: './request-signature.component.html',
  styleUrls: ['./request-signature.component.scss'],
  providers: [MessageService],
})
export class RequestSignatureComponent implements OnInit {
  approvers: any[] = [];
  approverType: string = 'PARALLEL';
  documentName: string = '';
  filteredApprovers: any[] = [];
  uploadForm: FormGroup | undefined;
  selectedApprovers: any[] = []; // Multiple selected approvers
  selectedApprover: any = {};
  datas: any[] = [];
  documentDialog: boolean = false;
  deleteDocumentDialog: boolean = false;
  submitted: boolean = false;
  distributionType: string = '';
  error: IError = {
    status: false,
    message: '',
    timestamp: 0,
  };
  postDocument: IDocumentPost = {};
  file: any;
  pdfSrc: any;
  blob: any;
  pdfDialog: boolean = false;
  historyDialog: boolean = false;
  documentHistory: any[] = [];

  constructor(
    private documentService: DocumentService,
    private messageService: MessageService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private userService: UserService,
    private pdfViewerService: NgxExtendedPdfViewerService
  ) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments() {
    this.documentService
      .getDocumentByUploader()
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

  onUpload(event: any): void {
    this.file = event.target.files[0];
    console.log(this.file);
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const fileData = e.target.result.split(',')[1];
        this.postDocument.fileData = fileData;
        this.loadPdf(fileData); // Panggil loadPdf setelah mendapatkan data PDF
      };
      reader.readAsDataURL(this.file);
    }
  }

  public async export(): Promise<void> {
    this.blob = await this.pdfViewerService.getCurrentDocumentAsBlob();
    return this.blob;
  }

  saveDocument() {
    this.submitted = true;
    // lakukan pengcekan apakah documentName sudah diisi atau belum
    if (!this.postDocument.documentName) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill the document name',
      });
      // lakukan pengcekan apakah file sudah diupload atau belum
    } else if (!this.postDocument.fileData) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please upload a file',
      });
      // lakukan pengcekan apakah selectedApprovers sudah diisi atau belum
    } else if (this.selectedApprovers.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select at least one approver',
      });
      // jika semua kondisi diatas terpenuhi, maka lakukan export dan save document
    } else {
      this.export();
      const formData = new FormData();

      if (this.postDocument.fileData) {
        formData.append('file', this.file);
      }

      this.documentService
        .saveDocument(
          formData,
          this.postDocument.documentName,
          this.approverType
        )
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.error = {
              status: true,
              message: error.message,
              timestamp: Date.now(),
            };
            if (error.status == 401) {
              this.error.message = 'Unauthorized';
            }
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: this.error.message,
            });
            return throwError(() => new Error('Error saving document'));
          })
        )
        .subscribe((response: any) => {
          this.assignApprovers(response.data.idDocument);
        });
    }
  }

  assignApprovers(idDocument: number) {
    const approverIds = this.selectedApprovers.map((approver) => ({
      idUser: approver.idUser,
    }));

    this.documentService
      .assignApprover(idDocument, { approverIds })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error = {
            status: true,
            message: error.message,
            timestamp: Date.now(),
          };
          if (error.status == 401) {
            this.error.message = 'Unauthorized';
          }
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.error.message,
          });
          return throwError(() => new Error('Error assigning approvers'));
        })
      )
      .subscribe(() => {
        this.loadDocuments();
        this.hideDialog();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Document sent to approver',
        });
      });
  }
  openPdfViewer(document: any): void {
    this.loadPdf(document.fileData);
    this.pdfDialog = true;
  }

  openNew(): void {
    this.userService
      .getAllUser()
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
        this.approvers = response.data;
      });

    this.postDocument = {};
    this.submitted = false;
    this.documentDialog = true;
    this.selectedApprovers = [];
  }

  hideDialog(): void {
    this.documentDialog = false;
    this.submitted = false;
    this.postDocument = {};
    this.selectedApprover = null;
  }

  hidePdfDialog(): void {
    this.pdfDialog = false;
    this.pdfSrc = null;
  }

  onGlobalFilter(event: Event, dt: any): void {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  addApprover() {
    if (
      this.selectedApprover &&
      !this.selectedApprovers.some(
        (approver) => approver.idUser === this.selectedApprover.idUser
      )
    ) {
      this.selectedApprovers.push(this.selectedApprover);
      this.selectedApprover = {};
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Duplicate Approver',
        detail: 'The selected approver is already added.',
      });
    }
  }

  removeApprover(approver: any) {
    this.selectedApprovers = this.selectedApprovers.filter(
      (a) => a !== approver
    );
  }

  filterApprover(event: any) {
    const query = event.query.toLowerCase();
    this.filteredApprovers = this.approvers
      .filter((approver) => approver.fullName.toLowerCase().includes(query))
      .map((approver) => ({
        ...approver,
        displayName: `${approver.fullName} (${approver.username})`,
      }));
  }

  getStatusBadgeClass(status: boolean): string {
    switch (status) {
      case true:
        return 'product-badge status-instock';
      case false:
        return 'product-badge status-lowstock';
      default:
        return '';
    }
  }

  viewHistory(idDocument: number): void {
    this.documentService
      .getDocumentHistory(idDocument)
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
            this.documentHistory = [];
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: this.error.message,
            });
          }
          return throwError(() => new Error('Error fetching document history'));
        })
      )
      .subscribe((response: any) => {
        this.documentHistory = response.data;
        console.log(this.documentHistory);
        this.historyDialog = true;
      });
  }

  hideHistoryDialog(): void {
    this.historyDialog = false;
    this.documentHistory = [];
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
