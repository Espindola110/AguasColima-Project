import { FavoriteService } from './../services/favorite.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ActionSheetController, Platform, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './../services/api.service'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';



@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private url: string ="https://semaforosinteligentes.000webhostapp.com/sensores/index.php";
  sensors: Observable<any>;
  items:any;
  sensor:any;
  isFavorite = false;
  idControl = null;
  data2:any;
  constructor(private alertCtrl: AlertController, private plt: Platform, private favoriteService: FavoriteService ,private api: ApiService, 
    private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, 
    public actionSheetController: ActionSheetController, private localNotifications: LocalNotifications ) {}
  
  ngOnInit() {
    this.idControl = this.activatedRoute.snapshot.paramMap.get('id');
    this.api.getSensor(this.idControl).subscribe(res => {
      this.sensor = res;
    });
    
 
    this.favoriteService.isFavorite(this.idControl).then(isFav => {
      this.isFavorite = isFav;
    });

    this.sensors = this.http.get(this.url); 
    this.sensors.subscribe(data => {
        this.items = data;
      });

    var timer = setInterval(()=> {
      const newdata = this.http.get(this.url); 
    newdata.subscribe(nwdata => {
        this.data2 = nwdata;
      });
      if (this.items !== this.data2){
        this.simpleNotif(this.items);
      }else if (this.items == this.data2){

      }
  },4000); 
  }

  simpleNotif(res) {
    this.localNotifications.schedule({
      id: res.idControl,
      text: res.nombre + 'en proceso de inundación',
      data: { mydata: 'buenas' },
    });
  }

  favoriteSensor() {
    this.favoriteService.favoriteSensor(this.idControl).then(() => {
      this.isFavorite = true;
    });
  }
 
  unfavoriteSensor() {
    this.favoriteService.unfavoriteFilm(this.idControl).then(() => {
      this.isFavorite = false;
    });
  }
  doRefresh(refresher) {
    console.log('Begin async operation');
      this.sensors.subscribe(data => {
      this.sensors = this.http.get(this.url);
      this.items = data;
      refresher.target.complete();
    }); 
  }
  async presentActionSheet(data){
    let flag;
if (this.isFavorite){
  const actionSheet = await this.actionSheetController.create({
    header:  data.nombre,
    subHeader: data.municipio,
    buttons: [{
      text: 'Desactivar Notificaciones',
      icon: 'heart',
      handler: () => {
          this.unfavoriteSensor();
          console.log("works!");
      }
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
      }
    }]
  });
  await actionSheet.present();
}else{
  const actionSheet = await this.actionSheetController.create({
    header:  data.nombre,
    subHeader: data.municipio,
    buttons: [{
      text: 'Activar Notificaciones',
      icon: 'heart',
      handler: () => {
          this.favoriteSensor();
          console.log("asiesworks!");
      }
    }, {
      text: 'Cancel',
      icon: 'close',
      role: 'cancel',
      handler: () => {
        console.log("works!no");
      }
    }]
  });
  await actionSheet.present();
}
  }

}
