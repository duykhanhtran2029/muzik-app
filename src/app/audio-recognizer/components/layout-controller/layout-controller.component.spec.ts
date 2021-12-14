import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutControllerComponent } from './layout-controller.component';

describe('LayoutControllerComponent', () => {
  let component: LayoutControllerComponent;
  let fixture: ComponentFixture<LayoutControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutControllerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
