import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MintabarangComponent } from './mintabarang.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: MintabarangComponent }
	])],
	exports: [RouterModule]
})
export class MintabarangRoutingModule { }
