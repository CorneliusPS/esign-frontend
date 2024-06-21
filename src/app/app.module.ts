import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { HttpClientModule } from '@angular/common/http';
import { ExamplePdfViewerComponent } from './example-pdf-viewer/example-pdf-viewer.component';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';

@NgModule({
  declarations: [AppComponent, NotfoundComponent, ExamplePdfViewerComponent],
  imports: [BrowserModule, AppRoutingModule, AppLayoutModule, HttpClientModule, NgxExtendedPdfViewerModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
