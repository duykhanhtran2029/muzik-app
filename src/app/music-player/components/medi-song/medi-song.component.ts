import { Component, OnInit, Input, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { SafeStyle, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-medi-song',
  templateUrl: './medi-song.component.html',
  styleUrls: ['./medi-song.component.scss']
})
export class MediSongComponent implements AfterViewInit, OnInit {
  @Input() iconSrc: string;
  @ViewChild('title') title: ElementRef;
  @ViewChild('name') name: ElementRef;
  image: SafeStyle;

  constructor(public sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.image = this.sanitizer.bypassSecurityTrustStyle(`url("${this.iconSrc}")`);

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.changeTitleHeight();
  }

  ngAfterViewInit(): void {
    this.changeTitleHeight();

  }

  changeTitleHeight() {
    this.name.nativeElement.style.setProperty('--title-height', `${this.title.nativeElement.offsetHeight}px`);
    this.name.nativeElement.style.setProperty('--name-height', `${this.name.nativeElement.offsetHeight}px`);
  }
}
