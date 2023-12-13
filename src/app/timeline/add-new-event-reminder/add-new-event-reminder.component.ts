import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef
} from '@angular/material/dialog';
import { PersonalTimeObject } from '../timeline.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatChipOption } from '@angular/material/chips';
import { RestService } from 'src/app/shared/services/Rest.service';

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
  data: any;
  type: string;

  constructor(public dialogRef: MatDialogRef<AddNewEventReminderComponent>,
    @Inject(MAT_DIALOG_DATA) public input: any,
    private formBuilder: FormBuilder, private restService: RestService) {

    this.data = input.data;
    this.type = input.type;
    console.log(this.data, this.type);

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
        daysBeforeToRemind: [this.data?.daysBeforeToRemind || 7],
        startTime: [this.data?.startTime || '12:00']
      }
    )

  }

  close() {
    this.dialogRef.close(null);
  }

  Submit() {
    if (this.formGroup.invalid) {
      this.formGroup.markAllAsTouched();
      return;
    }
    const v = new PersonalTimeObject(this.formGroup.getRawValue());
    if (this.lowChip.selected)
      v.priorityLevel = 0;
    else if (this.mediumChip.selected)
      v.priorityLevel = 1;
    else
      v.priorityLevel = 2;

    if (!this.reminde.nativeElement.checked)
      v.daysBeforeToRemind = 0;

    const d: Date = this.data.dateTime;
    const [h, m] = v.startTime.split(":");
    v.dateTime = new Date(d.setHours(Number(h), Number(m)))

    v.remindByEmail = this.emailReminder.nativeElement.checked;

    this.restService.post('Reminder/Create', v).subscribe((res) => {
      if (res['success'])
        this.dialogRef.close(v);
    })
  }
}
