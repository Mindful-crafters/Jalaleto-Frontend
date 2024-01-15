import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-post-event',
  templateUrl: './post-event.component.html',
  styleUrls: ['./post-event.component.scss']
})
export class PostEventComponent {
  formGroup: FormGroup;
  selectedImage: string | undefined;
  profilePicture: any | undefined;
  onFileSelected(event: any) {
    const file = event.target.files[0];

    if (file) {
      this.selectedImage = URL.createObjectURL(file);
      this.profilePicture = file;
    }
  }
}
