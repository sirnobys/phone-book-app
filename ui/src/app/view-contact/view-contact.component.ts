import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core'
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../service/contact.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ContactComponent, IContact } from '../contact/contact.component';

@Component({
  selector: 'app-view-contact',
  templateUrl: './view-contact.component.html',
  styleUrls: ['./view-contact.component.css']
})
export class ViewContactComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public dialogData: IContact,
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
    this.contactFormGroup.valueChanges.subscribe(e => {

      console.log(e);
    })

    this.contactFormGroup.patchValue({
      first_name: this.dialogData.first_name,
      last_name: this.dialogData.last_name,
      number: this.dialogData.number,
    })
  }

  canSave() {
    return this.contactFormGroup.valid
  }

  save() {
    this.loading = true
    const model = this.contactFormGroup.value
    const id = this.dialogData._id;
    console.log(model);

    this.contactService.updateContact(id, model).subscribe(e => {
      this.loading = false;
      this.snackBar.open('Updated contact successfully', 'close', { duration: 10000 })
      this.close()
    }, err => {
      this.loading = false;
      console.log(err);
      const message = err?.error?.message ? err?.error?.message : err?.statusText
      this.snackBar.open('error: ' + message, 'close', { duration: 10000 })
    })
  }

  close() {
    this.dialog.close()
  }

  handleErrorMessage(formControl: any) {
    const errors = this.contactFormGroup.get(formControl.name)?.errors
    const suffix = errors?.['pattern'] ? "is invalid" : errors?.['required'] ? 'is required' : ''

    return `${formControl?.title} ${suffix}`
  }
}
