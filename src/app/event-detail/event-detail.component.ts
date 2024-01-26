import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventClass } from '../shared/types/EventObject.type';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent {
  constructor(private dialogRef: DialogRef, @Inject(MAT_DIALOG_DATA) public data: EventClass) {

  }

  Close() {
    this.dialogRef.close(null);
  }
}
