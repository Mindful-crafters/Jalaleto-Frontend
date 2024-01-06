import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatChipOption } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RestService } from 'src/app/shared/services/Rest.service';
import { ReminderObject } from 'src/app/shared/types/ReminderObject';

@Component({
  selector: 'app-reminder-dialog',
  templateUrl: './reminder-dialog.component.html',
  styleUrls: ['./reminder-dialog.component.scss']
})
export class ReminderDialogComponent implements OnInit {

  formGroup: FormGroup;
  title: string = '';
  @ViewChild('low') lowChip: MatChipOption;
  @ViewChild('medium') mediumChip: MatChipOption;
  @ViewChild('high') high: MatChipOption;
  @ViewChild('check') reminde: ElementRef;
  @ViewChild('email') emailReminder: ElementRef;
  data: ReminderObject;
  priorityLevel: number = 0;

  constructor(
    public dialogRef: MatDialogRef<ReminderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public input: any,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private restService: RestService,
    private datePipe: DatePipe) {
    this.data = input.reminder;
    this.priorityLevel = this.data.priorityLevel;

    if(true){

    }
    console.log(this.data.daysBeforeToRemind)
    console.log(this.data.remindByEmail)

  }

  ngOnInit(): void {
    this.CreateForm();
  }

  initHour() {
    const date = new Date(this.data.dateTime);
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return hour + ':' + minutes;
  }

  CreateForm() {
    this.formGroup = this.formBuilder.group(
      {
        title: [this.data?.title || null, Validators.required],
        notes: [this.data?.notes || null],
        datePicker: [this.data.dateTime, Validators.required],
        daysBeforeToRemind: [this.data?.daysBeforeToRemind || 7],
        startTime: [this.initHour() || '12:00']
      }
    )
  }

  validateDate(control: AbstractControl): ValidationErrors | null {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);

    currentDate.setHours(0, 0, 0, 0);

    if (selectedDate < currentDate) {
      return { customError: true };
    } else {
      console.log('selected date : ', selectedDate)
      this.data.dateTime = selectedDate;
      return null;
    }
  }

  close() {
    this.dialogRef.close(null);
  }

  Submit() {
    if (this.formGroup.get('datePicker') == null) {

    }

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

    v.remindByEmail = this.emailReminder.nativeElement.checked;

    const startTimeValue = this.formGroup.get('startTime').value;
    const [h, m] = startTimeValue.split(":");

    let date: Date = new Date(this.data.dateTime);

    console.log('date', date);

    const localDateTime = new Date(date);
    const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const gmtDateTimeString = this.datePipe.transform(localDateTime, 'yyyy-MM-dd HH:mm:ss', 'GMT');
    const gmtDateTime = new Date(gmtDateTimeString);
    gmtDateTime.setUTCHours(Number(h), Number(m));

    v.dateTime = gmtDateTime;
    v.reminderId = this.data.reminderId;

    console.log('all', v.dateTime);

    this.restService.post('Reminder/Create', v).subscribe((res) => {
      if (res['success']) {
        this.toastr.success('رویداد با موفقیت ایجاد شد', 'موفقیت');
        this.dialogRef.close(v);
      }
      else {
        this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');
      }
    },
      (error: HttpErrorResponse) => {
        this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');

      })
  }
}
