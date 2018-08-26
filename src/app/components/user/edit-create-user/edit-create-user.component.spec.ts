import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreateUserComponent } from './edit-create-user.component';

describe('EditCreateUserComponent', () => {
  let component: EditCreateUserComponent;
  let fixture: ComponentFixture<EditCreateUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCreateUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
