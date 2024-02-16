import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
      private http: HttpClient
  ) { }

  sendFile(formData: FormData) {
    return this.http.post('http://localhost:5000/vocabulary/post', formData)
  }
}
