import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { SharedMaterialModule } from './shared-material.module';
import { FooterComponent } from './components/footer/footer.component';
import { HowToUseComponent } from './components/how-to-use/how-to-use.component';

@NgModule({
  declarations: [HeaderComponent, FooterComponent, HowToUseComponent],
  imports: [CommonModule, SharedMaterialModule],
  exports: [HeaderComponent, FooterComponent, HowToUseComponent],
})
export class SharedModule {}
