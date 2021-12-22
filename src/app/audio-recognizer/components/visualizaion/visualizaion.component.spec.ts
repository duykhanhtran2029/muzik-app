import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizaionComponent } from './visualizaion.component';

describe('VisualizaionComponent', () => {
  let component: VisualizaionComponent;
  let fixture: ComponentFixture<VisualizaionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualizaionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
