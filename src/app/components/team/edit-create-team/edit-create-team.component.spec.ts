import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCreateTeamComponent } from './edit-create-team.component';

describe('EditCreateTeamComponent', () => {
  let component: EditCreateTeamComponent;
  let fixture: ComponentFixture<EditCreateTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCreateTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCreateTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
