import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TracksControlComponent } from './tracks-control.component';

describe('TracksControlComponent', () => {
  let component: TracksControlComponent;
  let fixture: ComponentFixture<TracksControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TracksControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TracksControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
