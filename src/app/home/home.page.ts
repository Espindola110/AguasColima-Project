import { FavoriteService } from './../services/favorite.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ActionSheetController, Platform, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './../services/api.service'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import equal from 'deep-equal';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private url: string = "https://semaforosinteligentes.000webhostapp.com/sensores/index.php";
  sensors: Observable<any>;
  items: any;
  sensor: any;
  isFavorite = false;
  idControl = null;
  data2: any;

  constructor(private alertCtrl: AlertController, private plt: Platform, private favoriteService: FavoriteService, private api: ApiService,
    private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient,
    public actionSheetController: ActionSheetController, private localNotifications: LocalNotifications) { }

  ngOnInit() {
    this.sensors = this.http.get(this.url);
    this.sensors.subscribe(data => {
      this.items = data;
    });

    const timer = setInterval(async () => {
      const newdata = this.http.get(this.url);

      newdata.subscribe(nwdata => {
        this.data2 = nwdata;
      });

      const isEqual = equal(this.items, this.data2)

      if (isEqual) return

      const favorites = await Promise.all(this.data2.filter(async ({ idcontrol }) => await this.favoriteService.isFavorite(idcontrol)));
      const favoritesChanges = favorites.filter(favorite => {
        const idControl = favorite['idcontrol'];
        const sensor = this.items.find(item => item.idcontrol === idControl);
        return !equal(sensor, favorite);
      });

      favoritesChanges.forEach(item => this.simpleNotif(item));
    }, 4000);
  }

  simpleNotif(res) {
    this.localNotifications.schedule({
      id: res.idControl,
      text: res.nombre + 'en proceso de inundación',
      data: { mydata: 'buenas' }
    });
  }

  favoriteSensor({ idcontrol }) {
    this.favoriteService.favoriteSensor(idcontrol);
  }

  unfavoriteSensor({ idcontrol }) {
    this.favoriteService.unfavoriteFilm(idcontrol);
  }

  doRefresh(refresher) {
    console.log('Begin async operation');
    this.sensors.subscribe(data => {
      this.sensors = this.http.get(this.url);
      this.items = data;
      refresher.target.complete();
    });
  }

  async presentActionSheet(data) {
    // let flag;
    
    const idControl = data.idcontrol;
    const isFavorite = await this.favoriteService.isFavorite(idControl);

    if (isFavorite) {
      const actionSheet = await this.actionSheetController.create({
        header: data.nombre,
        subHeader: data.municipio,
        buttons: [{
          text: 'Desactivar Notificaciones',
          icon: 'heart',
          handler: () => {
            this.unfavoriteSensor(data);
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
    } else {
      const actionSheet = await this.actionSheetController.create({
        header: data.nombre,
        subHeader: data.municipio,
        buttons: [{
          text: 'Activar Notificaciones',
          icon: 'heart',
          handler: () => {
            this.favoriteSensor(data);
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
