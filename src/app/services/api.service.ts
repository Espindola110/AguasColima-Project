import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }
  getSensors() {
    return this.http.get('https://semaforosinteligentes.000webhostapp.com/sensores/index.php');
  }
  getSensor(id) {
    return this.http.get(`https://semaforosinteligentes.000webhostapp.com/sensores/api/index.php?%20idsensor=${id}`);
  }
}
