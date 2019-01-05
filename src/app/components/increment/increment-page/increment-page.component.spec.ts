import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IncrementPageComponent } from './increment-page.component';

describe('IncrementPageComponent', () => {
  let component: IncrementPageComponent;
  let fixture: ComponentFixture<IncrementPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IncrementPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IncrementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
