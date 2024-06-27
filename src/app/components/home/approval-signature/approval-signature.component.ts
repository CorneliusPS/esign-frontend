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

@Component({
  selector: 'app-approval-signature',
  templateUrl: './approval-signature.component.html',
  styleUrls: ['./approval-signature.component.scss'],
  providers: [MessageService],
})
export class ApprovalSignatureComponent implements OnInit {
  @ViewChild(SignaturePadComponent) signaturePad!: SignaturePadComponent;
  @ViewChild('signatureBoxCanvas')
  signatureBoxCanvas!: ElementRef<HTMLCanvasElement>;

  approvers: any[] = [];
  documentName: string = '';
  uploadForm: FormGroup | undefined;
  datas: any[] = [];
  approvalDialog: boolean = false;
  deleteDocumentDialog: boolean = false;
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
  drawing = false;
  box = { startX: 0, startY: 0, endX: 0, endY: 0 };

  signaturePadOptions: any = {
    minWidth: 1,
    canvasWidth: 500,
    canvasHeight: 300,
  };

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    public sanitizer: DomSanitizer,
    private approvalService: ApprovalService,
    private router: Router
  ) {}

  ngAfterViewInit(): void {
    this.loadDocuments();
  }

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
        this.datas = response.data;
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

  openDialog(idDocument: number) {
    this.approvalService
      .getOneApprover(idDocument)
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
  goToPageSignature(idApprover: number) {
    this.router.navigate(['/home/add-signature', idApprover]);
  }

  clearSignature(): void {
    this.signaturePad.clear();
  }

  startDrawing(event: MouseEvent): void {
    this.drawing = true;
    const rect = this.signatureBoxCanvas.nativeElement.getBoundingClientRect();
    this.box.startX = event.clientX - rect.left;
    this.box.startY = event.clientY - rect.top;
    this.signatureBoxCanvas.nativeElement.style.pointerEvents = 'auto'; // Enable pointer events
  }

  draw(event: MouseEvent): void {
    if (!this.drawing) return;
    const canvas = this.signatureBoxCanvas.nativeElement;
    const context = canvas.getContext('2d')!;
    const rect = canvas.getBoundingClientRect();

    this.box.endX = event.clientX - rect.left;
    this.box.endY = event.clientY - rect.top;

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = 'red';
    context.lineWidth = 2;
    context.strokeRect(
      this.box.startX,
      this.box.startY,
      this.box.endX - this.box.startX,
      this.box.endY - this.box.startY
    );
  }

  stopDrawing(): void {
    this.drawing = false;
    this.signatureBoxCanvas.nativeElement.style.pointerEvents = 'none'; // Disable pointer events
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
    const firstPage = pages[1];

    const signatureImage = await pdfDoc.embedPng(signatureImageBytes);
    const { width, height } = firstPage.getSize();
    const boxWidth = this.box.endX - this.box.startX;
    const boxHeight = this.box.endY - this.box.startY;

    // Calculate the center position of the signature box
    const centerX = this.box.startX + (boxWidth - signatureImage.width) / 2;
    const centerY =
      height -
      this.box.startY -
      (boxHeight - signatureImage.height) / 2 -
      signatureImage.height;

    firstPage.drawImage(signatureImage, {
      x: centerX,
      y: centerY, // Convert canvas coordinate to PDF coordinate
      width: signatureImage.width,
      height: signatureImage.height,
    });

    const modifiedPdfBytes = await pdfDoc.save();
    this.oneDocument.fileData = btoa(
      String.fromCharCode(...new Uint8Array(modifiedPdfBytes))
    );
  }
}
