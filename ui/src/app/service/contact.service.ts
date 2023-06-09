import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

let port = 3001
const URL = `http://localhost:${port}/`

@Injectable({
  providedIn: 'root'
})

export class ContactService {

  constructor(private http: HttpClient) { }

  getContacts(): Observable<any> {
    return this.http.get<any>(URL + 'contacts')
  }

  createContact(model: any): Observable<any> {
    return this.http.post(URL + 'contacts/create', model)
  }

  updateContact(id: any, model: any): Observable<any> {
    return this.http.put(URL + 'contacts/update/' + id, model)
  }

  deleteContact(id: any): Observable<any> {
    return this.http.delete(URL + 'contacts/delete/' + id)
  }
}
