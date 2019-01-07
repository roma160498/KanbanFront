import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableIterationsComponent } from './table-iterations.component';

describe('TableIterationsComponent', () => {
  let component: TableIterationsComponent;
  let fixture: ComponentFixture<TableIterationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableIterationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableIterationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
