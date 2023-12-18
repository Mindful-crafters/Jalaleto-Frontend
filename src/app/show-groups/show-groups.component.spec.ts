import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowGroupsComponent } from './show-groups.component';

describe('ShowGroupsComponent', () => {
  let component: ShowGroupsComponent;
  let fixture: ComponentFixture<ShowGroupsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShowGroupsComponent]
    });
    fixture = TestBed.createComponent(ShowGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
