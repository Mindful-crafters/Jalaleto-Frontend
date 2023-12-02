import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewEventReminderComponent } from './add-new-event-reminder.component';

describe('AddNewEventReminderComponent', () => {
  let component: AddNewEventReminderComponent;
  let fixture: ComponentFixture<AddNewEventReminderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewEventReminderComponent]
    });
    fixture = TestBed.createComponent(AddNewEventReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
