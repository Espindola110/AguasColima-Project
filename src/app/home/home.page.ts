import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  sensors: Observable<any>;
  constructor(private router: Router, private http: HttpClient) { }
 
  ngOnInit() {
    this.sensors = this.http.get('https://semaforosinteligentes.000webhostapp.com/sensores/index.php');
    this.sensors.subscribe(data => {
      console.log('my data: ', data);
    });
  }
}
