import { FavoriteService } from './../services/favorite.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ActionSheetController, Platform, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './../services/api.service'
import { LocalNotifications, ELocalNotificationTriggerUnit } from '@ionic-native/local-notifications/ngx';



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
  constructor(private plt: Platform, private favoriteService: FavoriteService ,private api: ApiService, 
    private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient, 
    public actionSheetController: ActionSheetController, private AlertCtrl: AlertController, private localNotifications: LocalNotifications ) {
      this.plt.ready().then(() => {
        this.localNotifications.on('trigger').subscribe(res => {
          let msg = res.data ? res.data.mydata : '';
          this.showAlert(res.title, res.text, msg);
        });
      });
     }
  scheduleNotification(data){
    if(data.sensor1 + data.sensor2 + data.sensor3 == 2){
      this.localNotifications.schedule({
        id: data.idControl,
        title: data.nombre,
        text: 'Alerta, vialidad den proceso de inundación',
        trigger: {in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
      });
    }else if (data.sensor1 + data.sensor2 + data.sensor3 == 3){
      this.localNotifications.schedule({
        id: data.idControl,
        title: data.nombre,
        text: 'Precaucion, Vialidad inundada',
        trigger: {in: 5, unit: ELocalNotificationTriggerUnit.SECOND },
      });
    }
    
  }
  showAlert(header, sub, msg){
    this.AlertCtrl.create({
      header: header,
      subHeader: sub,
      message: msg,
      buttons: ['Ok']
    }).then(alert =>alert.present());
  }
  ngOnInit() {
    this.idControl = this.activatedRoute.snapshot.paramMap.get('id');
    this.api.getSensor(this.idControl).subscribe(res => {
      this.sensor = res;
    });
 
    this.favoriteService.isFavorite(this.idControl).then(isFav => {
      this.isFavorite = isFav;
    });
  
    setInterval(()=> {
      this.sensors = this.http.get(this.url); },4000); 
      this.sensors.subscribe(data => {
      this.items = data;
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
    const actionSheet = await this.actionSheetController.create({
      header:  data.nombre,
      buttons: [{
        text: 'Favorito',
        icon: 'heart',
        handler: () => {
          if(this.isFavorite){
            this.unfavoriteSensor();
            icon: 'heart-outline'
          }else{
            this.favoriteSensor();
          }
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();
  }

}
