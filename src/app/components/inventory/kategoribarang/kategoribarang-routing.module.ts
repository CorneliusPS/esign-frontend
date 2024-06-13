import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { KategoribarangComponent } from './kategoribarang.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: KategoribarangComponent }
	])],
	exports: [RouterModule]
})
export class KategoribarangRoutingModule { }
