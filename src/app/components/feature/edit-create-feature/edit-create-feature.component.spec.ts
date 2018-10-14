import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreateFeatureComponent } from './edit-create-feature.component';

describe('EditCreateFeatureComponent', () => {
  let component: EditCreateFeatureComponent;
  let fixture: ComponentFixture<EditCreateFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCreateFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreateFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
