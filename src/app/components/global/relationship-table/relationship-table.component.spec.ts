import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipTableComponent } from './relationship-table.component';

describe('RelationshipTableComponent', () => {
  let component: RelationshipTableComponent;
  let fixture: ComponentFixture<RelationshipTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationshipTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
