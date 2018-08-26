import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemsToolbarComponent } from './items-toolbar.component';

describe('ItemsToolbarComponent', () => {
  let component: ItemsToolbarComponent;
  let fixture: ComponentFixture<ItemsToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemsToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
