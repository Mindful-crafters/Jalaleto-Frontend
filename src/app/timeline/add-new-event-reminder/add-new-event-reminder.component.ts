import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatChipOption } from '@angular/material/chips';
import { RestService } from 'src/app/shared/services/Rest.service';
import { ReminderObject } from 'src/app/shared/types/ReminderObject';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-new-event-reminder',
  templateUrl: './add-new-event-reminder.component.html',
  styleUrls: ['./add-new-event-reminder.component.scss']
})
export class AddNewEventReminderComponent implements OnInit {

  formGroup: FormGroup;
  title: string = '';
  @ViewChild('low') lowChip: MatChipOption;
  @ViewChild('medium') mediumChip: MatChipOption;
  @ViewChild('high') high: MatChipOption;
  @ViewChild('check') reminde: ElementRef;
  @ViewChild('email') emailReminder: ElementRef;
  data: ReminderObject;
  type: string;

  constructor(
    public dialogRef: MatDialogRef<AddNewEventReminderComponent>,
    @Inject(MAT_DIALOG_DATA) public input: any,
    private formBuilder: FormBuilder, private restService: RestService
    , private datePipe: DatePipe) {

    this.data = input.data;
    this.type = input.type;
  }

  ngOnInit(): void {
    this.CreateForm();

    if (!this.data.title)
      this.title = 'افزودن یادآوری جدید';
    else
      this.title = 'ویرایش یادآوری';
  }

  CreateForm() {
    this.formGroup = this.formBuilder.group(
      {
        title: [this.data?.title || null, Validators.required],
        notes: [this.data?.notes || null],
        datePicker: [this.data.dateTime],
        daysBeforeToRemind: [this.data?.daysBeforeToRemind || 7],
        startTime: ['12:00']
      }
    )
  }

  validateDate(control: AbstractControl): ValidationErrors | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);

    console.log(selectedDate)

    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      return { customError: true };
    } else {
      this.data.dateTime = selectedDate;
      return null;
    }
  }

  close() {
    this.dialogRef.close(null);
  }

  Submit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();

      return;
    }

    const v = new ReminderObject(this.formGroup.getRawValue());
    if (this.lowChip.selected)
      v.priorityLevel = 0;
    else if (this.mediumChip.selected)
      v.priorityLevel = 1;
    else
      v.priorityLevel = 2;

    if (!this.reminde.nativeElement.checked)
      v.daysBeforeToRemind = 0;

    const d: Date = this.data.dateTime;
    v.dateTime = this.data.dateTime;

    v.remindByEmail = this.emailReminder.nativeElement.checked;

    // const [h, m] = this.formGroup.get('startTime').value.split(":");
    // v.dateTime = new Date(d.setHours(Number(h), Number(m)))
    // v.repeatInterval = 1;
    // console.log(v);

    const startTimeValue = this.formGroup.get('startTime').value;
    const [h, m] = startTimeValue.split(":");
    const localDateTime = new Date();
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const gmtDateTimeString = this.datePipe.transform(localDateTime, 'yyyy-MM-dd HH:mm:ss', 'GMT');
    const gmtDateTime = new Date(gmtDateTimeString);
    gmtDateTime.setUTCHours(Number(h), Number(m));

    v.dateTime = gmtDateTime;
    v.repeatInterval = 1;
    console.log(v);

    this.restService.post('Reminder/Create', v).subscribe((res) => {
      if (res['success'])
        this.dialogRef.close(v);
      console.log(res);
    })
  }
}
