import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreateProductComponent } from './edit-create-product.component';

describe('EditCreateProductComponent', () => {
  let component: EditCreateProductComponent;
  let fixture: ComponentFixture<EditCreateProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCreateProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreateProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
