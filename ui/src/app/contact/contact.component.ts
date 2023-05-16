import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ContactService } from '../service/contact.service';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import { AddContactComponent } from '../add-contact/add-contact.component';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})


export class ContactComponent implements OnInit, OnChanges {
  constructor(private contactService:ContactService, public dialog: MatDialog){

  }
  dialogRef:any
  displayedColumns: string[] = ['first_name', 'last_name', 'number'];
  dataSource = new MatTableDataSource<IContact>();
  contacts:any = []
  contactInfo = new FormControl('');
  @ViewChild(MatPaginator) paginator: any;

  ngOnInit(){  
    this.dataSource.paginator = this.paginator;  
    this.update()
  }
ngOnChanges(changes: SimpleChanges): void {
  this.update()
}
  openDialog() {
    this.dialogRef = this.dialog.open(AddContactComponent,{data:true,width:'400px'}).afterClosed().subscribe(data=>{
      this.update()      
    });
  }


  update(){
    this.contactService.getContacts().subscribe(data=>{
      this.contacts = data
    })
  }
}

export interface IContact {
  first_name: string;
  last_name: string;
  number: number;
}