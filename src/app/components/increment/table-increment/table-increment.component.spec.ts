import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableIncrementComponent } from './table-increment.component';

describe('TableIncrementComponent', () => {
  let component: TableIncrementComponent;
  let fixture: ComponentFixture<TableIncrementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableIncrementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableIncrementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
