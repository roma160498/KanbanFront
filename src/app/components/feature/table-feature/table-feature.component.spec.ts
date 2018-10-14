import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFeatureComponent } from './table-feature.component';

describe('TableFeatureComponent', () => {
  let component: TableFeatureComponent;
  let fixture: ComponentFixture<TableFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableFeatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
