import { animate, style, AnimationBuilder } from '@angular/animations';
import { ListKeyManager } from '@angular/cdk/a11y';
import { isPlatformBrowser } from '@angular/common';
import {
  AfterContentInit,
  AfterViewInit,
  Component,
  ContentChildren,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  PLATFORM_ID,
  QueryList,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { interval, BehaviorSubject, Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { CarouselSlideComponent } from './carousel-slide/carousel-slide.component';

enum Direction {
  Left,
  Right,
  Index
}

export type Orientation = 'ltr' | 'rtl';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent
  implements AfterContentInit, AfterViewInit, OnDestroy {

  @Input() timings = '250ms ease-in';
  @Input() autoplay = true;
  @Input() interval = 5000;
  @Input() loop = true;
  @Input() hideArrows = false;
  @Input() hideIndicators = false;
  @Input() pauseOnHover = true;
  @Input() color: ThemePalette = 'accent';
  @Input() maintainAspectRatio = true;
  @Input() slides: number;
  @Input() useKeyboard = true;
  @Input() useMouseWheel = true;
  @Input() orientation: Orientation = 'ltr';

  @ContentChildren(CarouselSlideComponent) slidesList: QueryList<CarouselSlideComponent>;
  @ViewChild('carouselContainer') carouselContainer: ElementRef<HTMLDivElement>;
  @ViewChild('carouselList') carouselList: ElementRef<HTMLElement>;
  listKeyManager: ListKeyManager<CarouselSlideComponent>;

  autoplay$ = new Subject<boolean>();
  interval$ = new BehaviorSubject<number>(5000);
  slides$ = new BehaviorSubject<number>(null);
  maxWidth$ = new Subject<never>();
  loop$ = new Subject<boolean>();
  orientation$ = new Subject<Orientation>();
  timer$: Observable<number>;
  timerStop$ = new Subject<void>();
  destroy$ = new Subject<void>();
  playing = false;

  constructor(
    private animationBuilder: AnimationBuilder,
    private renderer: Renderer2,
    @Inject(PLATFORM_ID) private platformId
  ) { }

  @HostListener('keyup', ['$event'])
  onKeyUp(event: KeyboardEvent): void {
    if (this.useKeyboard && !this.playing) {
      this.listKeyManager.onKeydown(event);
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (this.pauseOnHover) {
      this.stopTimer();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.pauseOnHover) {
      this.startTimer(this.autoplay);
    }
  }

  @HostListener('mousewheel', ['$event'])
  onMouseWheel(event: WheelEvent): void {
    if (this.useMouseWheel) {
      event.preventDefault(); // prevent window to scroll
      const delta = Math.sign(event.deltaY);

      if (delta > 0) {
        this.next();
      } else if (delta < 0) {
        this.previous();
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.slideTo(0);
  }

  ngAfterContentInit(): void {
    this.listKeyManager = new ListKeyManager(this.slidesList)
      .withVerticalOrientation(false)
      .withHorizontalOrientation(this.orientation)
      .withWrap(this.loop);

    this.listKeyManager.updateActiveItem(0);
    this.listKeyManager.change
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.playAnimation());
  }

  ngAfterViewInit(): void {
    this.autoplay$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.stopTimer();
      this.startTimer(value);
    });

    this.interval$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.stopTimer();
      this.resetTimer(value);
      this.startTimer(this.autoplay);
    });

    this.maxWidth$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.slideTo(0));

    this.loop$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.listKeyManager.withWrap(value));

    this.orientation$
      .pipe(takeUntil(this.destroy$))
      .subscribe(value => this.listKeyManager.withHorizontalOrientation(value));

    this.slides$
      .pipe(
        takeUntil(this.destroy$),
        filter(value => value && value < this.slidesList.length)
      )
      .subscribe(value => this.resetSlides(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  next(): void {
    this.goto(Direction.Right);
  }

  previous(): void {
    this.goto(Direction.Left);
  }

  slideTo(index: number): void {
    this.goto(Direction.Index, index);
  }

  onPan(event: any, slideElem: HTMLElement): void {
    if (Math.abs(event.velocityY) > Math.abs(event.velocityX)) {
      return;
    }
    let deltaX = event.deltaX;
    if (this.isOutOfBounds()) {
      deltaX *= 0.2;
    }

    this.renderer.setStyle(slideElem, 'cursor', 'grabbing');
    this.renderer.setStyle(
      this.carouselList.nativeElement,
      'transform',
      this.getTranslation(this.getOffset() + deltaX)
    );
  }

  onPanEnd(event: any, slideElem: HTMLElement): void {
    this.renderer.removeStyle(slideElem, 'cursor');

    //! disable loop
    // if (!this.isOutOfBounds() && Math.abs(event.deltaX) > this.getWidth() * 0.25)
    if (Math.abs(event.deltaX) > this.getWidth() * 0.25) {
      if (event.deltaX <= 0) {
        this.next();
        return;
      }
      this.previous();
      return;
    }
    this.playAnimation();
  }

  isOutOfBounds(): boolean {
    const sign = this.orientation === 'rtl' ? -1 : 1;
    const left =
      sign *
      (this.carouselList.nativeElement.getBoundingClientRect().left -
        this.carouselList.nativeElement.offsetParent.getBoundingClientRect()
          .left);
    const lastIndex = this.slidesList.length - 1;
    const width = -this.getWidth() * lastIndex;

    return (
      (this.listKeyManager.activeItemIndex === 0 && left >= 0) ||
      (this.listKeyManager.activeItemIndex === lastIndex && left <= width)
    );
  }

  isVisible(): boolean {
    if (!isPlatformBrowser(this.platformId)) {
      return false;
    }

    const elem = this.carouselContainer.nativeElement;
    const docViewTop = window.pageYOffset;
    const docViewBottom = docViewTop + window.innerHeight;
    const elemOffset = elem.getBoundingClientRect();
    const elemTop = docViewTop + elemOffset.top;
    const elemBottom = elemTop + elemOffset.height;

    return elemBottom <= docViewBottom || elemTop >= docViewTop;
  }

  getOffset(): number {
    const offset = this.listKeyManager.activeItemIndex * this.getWidth();
    const sign = this.orientation === 'rtl' ? 1 : -1;
    return sign * offset;
  }

  getTranslation(offset: number): string {
    return `translateX(${offset}px)`;
  }

  getWidth(): number {
    return this.carouselContainer.nativeElement.clientWidth;
  }

  goto(direction: Direction, index?: number): void {
    if (!this.playing) {
      const rtl = this.orientation === 'rtl';

      switch (direction) {
        case Direction.Left:
          return rtl
            ? this.listKeyManager.setNextItemActive()
            : this.listKeyManager.setPreviousItemActive();
        case Direction.Right:
          return rtl
            ? this.listKeyManager.setPreviousItemActive()
            : this.listKeyManager.setNextItemActive();
        case Direction.Index:
          return this.listKeyManager.setActiveItem(index);
      }
    }
  }

  playAnimation(): void {
    const translation = this.getTranslation(this.getOffset());
    const factory = this.animationBuilder.build(
      animate(this.timings, style({ transform: translation }))
    );
    const animation = factory.create(this.carouselList.nativeElement);

    animation.onStart(() => {
      this.playing = true;
    });
    animation.onDone(() => {
      this.playing = false;
      this.renderer.setStyle(
        this.carouselList.nativeElement,
        'transform',
        translation
      );
      animation.destroy();
    });
    animation.play();
  }

  resetSlides(slides: number): void {
    this.slidesList.reset(this.slidesList.toArray().slice(0, slides));
  }

  resetTimer(value: number): void {
    this.timer$ = interval(value);
  }

  startTimer(autoplay: boolean): void {
    if (!autoplay) {
      return;
    }

    this.timer$
      .pipe(
        takeUntil(this.timerStop$),
        takeUntil(this.destroy$),
        filter(() => this.isVisible())
      )
      .subscribe(() => {
        this.listKeyManager.withWrap(true).setNextItemActive();
        this.listKeyManager.withWrap(this.loop);
      });
  }

  stopTimer(): void {
    this.timerStop$.next();
  }

  getCurrentIndex(): number {
    if (this.listKeyManager) {
      return this.listKeyManager.activeItemIndex;
    }

    return 0;
  }
}
