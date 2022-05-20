import { ListKeyManagerOption } from '@angular/cdk/a11y';
import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';

@Component({
  selector: 'app-carousel-slide',
  templateUrl: './carousel-slide.component.html',
  styleUrls: ['./carousel-slide.component.scss']
})
export class CarouselSlideComponent
  implements ListKeyManagerOption, OnInit {
  @Input() image: SafeStyle;
  @Input() disabled = false;

  @ViewChild(TemplateRef) public templateRef: TemplateRef<any>;
  constructor(public sanitizer: DomSanitizer) {
  }

  public ngOnInit(): void {
    if (this.image) {
      this.image = this.sanitizer.bypassSecurityTrustStyle(`url("${this.image}")`);
    }
  }
}
