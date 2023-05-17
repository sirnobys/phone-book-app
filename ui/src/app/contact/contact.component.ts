import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ContactService } from '../service/contact.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AddContactComponent } from '../add-contact/add-contact.component';
import { ViewContactComponent } from '../view-contact/view-contact.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})


export class ContactComponent implements OnInit, OnChanges {
  loading: boolean = false;
  dialogRef: any
  displayedColumns: string[] = ['first_name', 'last_name', 'number'];
  dataSource = new MatTableDataSource<IContact>();
  contacts: any[] = []
  search = new FormControl('');
  contactCopy: any[] = []
  @ViewChild(MatPaginator) paginator: any;

  constructor(private contactService: ContactService, public dialog: MatDialog, private snackBar: MatSnackBar) {

  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.search.valueChanges.subscribe(e => {
      this.contacts = this.searchContact(e)
    })
    this.update()
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.update()
  }
  openDialog() {
    this.dialogRef = this.dialog.open(AddContactComponent, { data: true, width: '400px' }).afterClosed().subscribe(data => {
      if (data) {
        this.update()
      }
    });
  }
  openUpdateDialog(id: any) {
    this.dialogRef = this.dialog.open(ViewContactComponent, { data: id, width: '400px' }).afterClosed().subscribe(data => {

      if (data) {
        this.update()
      }
    });
  }

  update() {
    this.loading = true
    this.contactService.getContacts().subscribe(data => {
      this.loading = false
      this.contacts = data
      this.contactCopy = data
    }, err => {
      this.loading = false;
      console.log(err);
      const message = err?.error?.message ? err?.error?.message : err?.statusText
      this.snackBar.open('error: ' + message, 'close', { duration: 10000 })
    })
  }

  deleteContact(id: any) {
    const canDelete = window.confirm('Are you sure you want to delete?')
    if (!canDelete) {
      return
    }
    this.contactService.deleteContact(id).subscribe(e => {
      this.loading = false;
      this.snackBar.open('contact deleted successfully', 'close', { duration: 10000 })
      this.update()
    }, err => {
      this.loading = false;
      console.log(err);
      const message = err?.error?.message ? err?.error?.message : err?.statusText
      this.snackBar.open('error: ' + message, 'close', { duration: 10000 })
    })
  }

  searchContact(text: any) {
    let search = this.contactCopy.filter(e => [e?.['first_name'], e?.['last_name'], e?.['number']].join(' ').toLocaleLowerCase().includes(text.toLocaleLowerCase()))
    return search
  }
}

export interface IContact {
  first_name: string;
  last_name: string;
  number: number;
  _id: number;
}