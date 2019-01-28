import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableIssuesComponent } from './table-issues.component';

describe('TableIssuesComponent', () => {
  let component: TableIssuesComponent;
  let fixture: ComponentFixture<TableIssuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableIssuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
