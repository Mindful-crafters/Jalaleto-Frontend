import { CreateEvent } from './../../shared/types/CreateEvent.type';
import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, ViewChild, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent, MatChipOption } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { RestService } from 'src/app/shared/services/Rest.service';
import { AddNewEventReminderComponent } from '../add-new-event-reminder/add-new-event-reminder.component';
import { Observable, map, retry, startWith } from 'rxjs';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Group } from 'src/app/navbar/navbar.component';
import {
  NzSkeletonAvatarShape,
  NzSkeletonAvatarSize,
  NzSkeletonButtonShape,
  NzSkeletonButtonSize,
  NzSkeletonInputSize
} from 'ng-zorro-antd/skeleton';

@Component({
  selector: 'app-add-event-dialog',
  templateUrl: './add-event-dialog.component.html',
  styleUrls: ['./add-event-dialog.component.scss']
})
export class AddEventDialogComponent {
  buttonActive = true;
  avatarActive = true;
  inputActive = true;
  imageActive = true;
  buttonSize: NzSkeletonButtonSize = 'default';
  avatarSize: NzSkeletonAvatarSize = 'default';
  inputSize: NzSkeletonInputSize = 'default';
  elementActive = true;
  buttonShape: NzSkeletonButtonShape = 'default';
  avatarShape: NzSkeletonAvatarShape = 'circle';
  elementSize: NzSkeletonInputSize = 'default';
  selectedGroup: Group = null;
  groups = ['hi'];
  formGroup: FormGroup;
  title: string = '';
  @ViewChild('low') lowChip: MatChipOption;
  @ViewChild('medium') mediumChip: MatChipOption;
  @ViewChild('high') high: MatChipOption;
  @ViewChild('check') reminde: ElementRef;
  @ViewChild('email') emailReminder: ElementRef;
  type: string;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl('');
  filteredFruits: Observable<string[]>;
  fruits: string[] = [];
  allFruits: string[] = ['ورزشی', 'گیم', 'طبیعت', 'اجتماعی', 'درسی'];
  myGroups: Group[];

  inputEvent: CreateEvent = {
    eventId: null,
    groupId: null,
    name: null,
    description: null,
    when: null,
    location: null,
    memberLimit: null,
    tag: []
  };

  isMyGroupsLoading = true;
  @ViewChild('fruitInput') fruitInput: ElementRef<HTMLInputElement>;

  announcer = inject(LiveAnnouncer);

  constructor(
    public dialogRef: MatDialogRef<AddNewEventReminderComponent>,
    @Inject(MAT_DIALOG_DATA) public inputDate: any,
    private toastr: ToastrService,
    private formBuilder: FormBuilder,
    private restService: RestService
    , private datePipe: DatePipe) {

    if (inputDate.event) {
      this.inputEvent = inputDate.event;
      this.fruits = this.inputEvent.tag

      console.log('input event : ', this.inputEvent)
    }

    this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
      startWith(null),
      map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    );
  }

  ngOnInit(): void {
    this.CreateForm();

    this.restService.post('Group/Groups?FilterMyGroups=true', null).subscribe((res) => {
      console.log(res);
      this.myGroups = res['data'];
      this.isMyGroupsLoading = false;
      console.log('my groups : ',this.myGroups)

      this.myGroups.forEach(element => {
        if(element.groupId == this.inputEvent.groupId){
          this.selectedGroup = element;
        }
      });

      if(this.selectedGroup == null && this.myGroups.length > 0){
        this.selectedGroup = this.myGroups[0]
      }
    })
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.fruits.includes(event.option.viewValue)) {
      this.fruits.push(event.option.viewValue);
      this.fruitInput.nativeElement.value = '';
      this.fruitCtrl.setValue(null);
    }
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allFruits.filter(fruit => fruit.toLowerCase().includes(filterValue));
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      console.log('value', value)
      console.log('list', this.fruits)
      if (this.allFruits.includes(value) && !this.fruits.includes(value)) {
        this.fruits.push(value);
      }
    }

    // Clear the input value
    event.chipInput!.clear();

    this.fruitCtrl.setValue(null);

  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);

      this.announcer.announce(`Removed ${fruit}`);
    }
  }

  initHour() {
    if (this.inputEvent.when != null) {
      const date = new Date(this.inputEvent.when);
      const hour = date.getHours();
      const minutes = date.getMinutes();
      return hour + ':' + minutes;
    }
    return '12:00'
  }

  CreateForm() {
    this.formGroup = this.formBuilder.group(
      {
        title: [this.inputEvent.name || null, Validators.required],
        description: [this.inputEvent.description || null, Validators.required],
        startTime: [this.initHour(), Validators.required],
        memberLimit: [this.inputEvent.memberLimit, [this.numberValidator]],
        groupSelected: [null , Validators.required]
      }
    )
  }

  numberValidator(control: AbstractControl): { [key: string]: any } | null {
    if (control.value === null) {
      return { 'isNull': true };
    }

    if (control.value == 0) {
      return { 'isZero': true };
    }

    const isNumber = /^[0-9]+$/.test(control.value);
    return isNumber ? null : { 'notANumber': true };

  }

  close() {
    this.dialogRef.close(null);
  }

  Submit() {
    console.log('start')
    // if (this.formGroup.invalid) {
    //   console.log(this.formGroup.getRawValue())
    //   this.formGroup.markAllAsTouched();
    //   return;
    // }

    const event: CreateEvent = {
      eventId: null,
      groupId: 0,
      name: '',
      description: '',
      when: null,
      location: '',
      memberLimit: 0,
      tag: []
    };

    //event id (if is not null used for update)
    if (this.inputEvent.eventId != null) {
      const eventId = this.inputEvent.eventId;
      event.eventId = eventId;
    }

    //group Id
    console.log('group id selected from box: ', this.formGroup.get('groupSelected').value)
    console.log('group id selected from value: ', this.selectedGroup)
    const groupId = this.selectedGroup.groupId;
    //group Name
    const groupName = this.formGroup.get('title').value;
    //description
    const description = this.formGroup.get('description').value;
    //location
    const location = '';
    const memberLimit = this.formGroup.get('memberLimit').value;
    //when
    const startTimeValue = this.formGroup.get('startTime').value;
    const [h, m] = startTimeValue.split(":");

    let localDateTime = new Date(this.inputDate);
    if (this.inputEvent.eventId) {
      localDateTime = new Date(this.inputEvent.when);
    }

    // Set the local time with the adjusted UTC hours and minutes
    const localDateTimeWithOffset = new Date(localDateTime);
    localDateTimeWithOffset.setDate(localDateTimeWithOffset.getDate());
    localDateTimeWithOffset.setUTCHours(Number(h), Number(m));
    //tags
    const tags = this.fruits;
    event.groupId = groupId;
    event.name = groupName;
    event.description = description;
    event.location = location;
    event.when = localDateTimeWithOffset;
    event.memberLimit = memberLimit;
    event.tag = tags;

    console.log(event);

    this.restService.post('Event/Create', event).subscribe((res) => {
      if (res['success']) {
        this.toastr.success('رویداد با موفقیت ایجاد شد', 'موفقیت');
        console.log(res)
        this.dialogRef.close(res);
      }
      else {
        console.log(res)
        this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');
      }
    },
      (error: HttpErrorResponse) => {
        this.toastr.error('مشکلی پیش آمده دوباره تلاش کنید', 'خطا');
      })
  }
}
