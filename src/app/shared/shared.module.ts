import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SharedMaterialModule } from './shared-material.module';



@NgModule({
  declarations: [
    HeaderComponent
  ],
  imports: [
    CommonModule,
    SharedMaterialModule
  ],
  exports: [
    HeaderComponent
]
})
export class SharedModule { }
