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

@Component({
  selector: 'app-request-signature',
  templateUrl: './request-signature.component.html',
  styleUrls: ['./request-signature.component.scss'],
  providers: [MessageService],
})
export class RequestSignatureComponent implements OnInit {
  approvers: any[] = [];
  documentName: string = '';
  filteredApprovers: any[] = [];
  uploadForm: FormGroup | undefined;
  selectedApprovers: any[] = []; // Multiple selected approvers
  selectedApprover: any = {};
  documents: any[] = [];
  selectedDocuments: any[] = [];
  documentDialog: boolean = false;
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

  file: any;

  distributionOptions = [
    { label: 'Parallel', value: 'parallel' },
    { label: 'Serial', value: 'serial' },
  ];

  constructor(
    private documentService: DocumentService,
    private messageService: MessageService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private userService: UserService
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
        this.documents = response.data;
      });
  }

  onUpload(event: any): void {
    this.file = event.target.files[0];
    console.log(this.file);
    if (this.file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.postDocument.fileData = e.target.result.split(',')[1];
      };
      reader.readAsDataURL(this.file);
    }
  }

  saveDocument() {
    const formData = new FormData();

    if (this.postDocument.fileData) {
      formData.append('file', this.file);
    }

    this.documentService
      .saveDocument(formData, this.postDocument.documentName)
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
  }

  onGlobalFilter(event: Event, dt: any): void {
    dt.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

  addApprover() {
    if (
      this.selectedApprover &&
      !this.selectedApprovers.includes(this.selectedApprover)
    ) {
      this.selectedApprovers.push(this.selectedApprover);
      this.selectedApprover = [];
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
        return 'product-badge status-outofstock';
      default:
        return '';
    }
  }
}
