import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreateIterationComponent } from './edit-create-iteration.component';

describe('EditCreateIterationComponent', () => {
  let component: EditCreateIterationComponent;
  let fixture: ComponentFixture<EditCreateIterationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCreateIterationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreateIterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
