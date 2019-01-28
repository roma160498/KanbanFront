import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreateIssueComponent } from './edit-create-issue.component';

describe('EditCreateIssueComponent', () => {
  let component: EditCreateIssueComponent;
  let fixture: ComponentFixture<EditCreateIssueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCreateIssueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreateIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
