import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreateIncrementComponent } from './edit-create-increment.component';

describe('EditCreateIncrementComponent', () => {
  let component: EditCreateIncrementComponent;
  let fixture: ComponentFixture<EditCreateIncrementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCreateIncrementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreateIncrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
