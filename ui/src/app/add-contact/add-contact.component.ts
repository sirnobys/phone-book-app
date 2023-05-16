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
  @ViewChild(ContactComponent) contactComponent!: ContactComponent

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
    console.log(this.data)
    console.log(this.contactFormGroup);
    this.contactFormGroup.valueChanges.subscribe(e => {
      console.log(this.contactFormGroup.get('first_name')?.errors);
      console.log(e);
    })
  }

  close() {
    this.dialog.close()
  }

  canSave() {
    return this.contactFormGroup.valid
  }

  save() {
    this.loading = true
    const model = this.contactFormGroup.value
    console.log(model);

    this.contactService.createContact(model).subscribe(e => {
      this.loading = false
      this.snackBar.open('contact created successfully')
      this.close()
    }, err => {
      this.loading = false
      console.log(err);
      this.snackBar.open('error: ' + err?.statusText, 'close', { duration: 5000 })
    })
  }

  handleErrorMessage(formControl: any) {
    const errors = this.contactFormGroup.get(formControl.name)?.errors
    const suffix = errors?.['pattern'] ? "is invalid" : errors?.['required'] ? 'is required' : ''

    return `${formControl?.title} ${suffix}`
  }
}
