import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core'
import { ContactComponent } from '../contact/contact.component';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../service/contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-contact',
  templateUrl: './add-contact.component.html',
  styleUrls: ['./add-contact.component.css']
})
export class AddContactComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialog: MatDialogRef<ContactComponent>,
    private fb: FormBuilder,
    private contactService: ContactService,
    private snackBar: MatSnackBar
  ) { }
  formControls: any = [
    { name: 'first_name', title: 'First Name', type: 'text' },
    { name: 'last_name', title: 'Last Name', type: 'text' },
    { name: 'number', title: 'Number', type: 'text' }
  ]
  loading: Boolean = false;

  contactFormGroup: FormGroup = this.fb.group({
    first_name: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
    last_name: ['', Validators.required],
    number: ['', [Validators.required, Validators.pattern('\\d+')]]
  })

  ngAfterViewInit() {

  }

  close(close:boolean) {
    this.dialog.close(close)
  }

  canSave() {
    return this.contactFormGroup.valid
  }

  save() {
    this.loading = true
    const model = this.contactFormGroup.value
  
    this.contactService.createContact(model).subscribe(e => {
      this.loading = false;
      this.snackBar.open('contact created successfully', 'close', { duration: 10000 })
      this.close(true)
    }, err => {
      this.loading = false;
      console.log(err);
      const message = err?.error?.message ? err?.error?.message : err?.statusText
      this.snackBar.open('error: ' + message, 'close', { duration: 10000 })
    })
  }

  handleErrorMessage(formControl: any) {
    const errors = this.contactFormGroup.get(formControl.name)?.errors
    const suffix = errors?.['pattern'] ? "is invalid" : errors?.['required'] ? 'is required' : ''

    return `${formControl?.title} ${suffix}`
  }
}
