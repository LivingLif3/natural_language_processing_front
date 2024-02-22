import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  sendFile(formData: FormData) {
    return this.http.post('http://localhost:5000/vocabulary/post', formData);
  }

  deleteWord(id: number) {
    return this.http.delete(`http://localhost:5000/vocabulary/delete/${id}`);
  }

  getAllWords() {
    return this.http.get('http://localhost:5000/vocabulary/getAll');
  }

  updateWord(id: number, data: any) {
    return this.http.patch(
      `http://localhost:5000/vocabulary/patch/${id}`,
      data
    );
  }
}
