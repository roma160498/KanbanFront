import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IterationPageComponent } from './iteration-page.component';

describe('IterationPageComponent', () => {
  let component: IterationPageComponent;
  let fixture: ComponentFixture<IterationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IterationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IterationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
