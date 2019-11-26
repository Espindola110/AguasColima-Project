import { FavoriteService } from './../services/favorite.service';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ActionSheetController, Platform, AlertController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from './../services/api.service'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
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

  constructor(private statusBar: StatusBar, private plt: Platform, private favoriteService: FavoriteService, private api: ApiService,
    private activatedRoute: ActivatedRoute, private router: Router, private http: HttpClient,
    public actionSheetController: ActionSheetController, private localNotifications: LocalNotifications) { }

  ngOnInit() {
    this.statusBar.overlaysWebView(true);

    this.statusBar.backgroundColorByHexString('#ffffff');
    
    this.statusBar.show();
    
    this.sensors = this.http.get(this.url);
    this.sensors.subscribe(data => {
      this.items = data;
    });

    const timer = setInterval(async () => {
      await new Promise((resolve, reject) => {
        this.http.get(this.url).subscribe(newData => {
          this.data2 = newData || [];
          resolve(newData);
        });
      });

      const isEqual = equal(this.items, this.data2)

      if (isEqual) return

      const favoriteList = (await this.favoriteService.getAllFavoriteSensors()) || []

      function extractProps(obj, props) {
        return props.map(prop => obj[prop])
      }

      if (favoriteList.length > 0) {
        console.log(favoriteList)
        const favorites = this.data2.filter(({ idcontrol }) => favoriteList.includes(idcontrol));
        console.log(favorites)
  
        const props = ['sensor1', 'sensor2', 'sensor3']
        const favoritesChanges = favorites.filter(favorite => {
          const idControl = favorite['idcontrol'];
          const sensor = this.items.find(item => item.idcontrol === idControl);
          return !equal(extractProps(sensor, props), extractProps(favorite, props));
        });
        favoritesChanges.forEach(item => this.simpleNotif(item));
      }

      this.items = this.data2
    }, 4000);
  }

  simpleNotif(res) {
    if(res.sensor1 + '' + res.sensor2 + '' +res.sensor3 == '111'){
      this.localNotifications.schedule({
        id: res.idcontrol,
        text: res.nombre + ' Vialidad Inundada',
        smallIcon: 'https://www.stickpng.com/assets/images/58afdad6829958a978a4a693.png',
        icon: 'https://pngimage.net/wp-content/uploads/2018/06/semaforo-png-3.png',
        data: { mydata: 'buenas' }
      });
    } else if (res.sensor1 + res.sensor2 + res.sensor3 == '110'){
      this.localNotifications.schedule({
        id: res.idcontrol,
        text: res.nombre + ' Vialidad en proceso de Inundada',
        icon: 'https://previews.123rf.com/images/nikdoorg/nikdoorg1511/nikdoorg151100027/47920820-s%C3%ADmbolo-del-sem%C3%A1foro.jpg',
        data: { mydata: 'buenas' }
      });
    }else{
      this.localNotifications.schedule({
        id: res.idcontrol,
        text: res.nombre + ' Vialidad Libre',
        icon: 'https://previews.123rf.com/images/nikdoorg/nikdoorg1511/nikdoorg151100027/47920820-s%C3%ADmbolo-del-sem%C3%A1foro.jpg',
        data: { mydata: 'buenas' }
      });
    }
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
          text: 'Cancelar',
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
          text: 'Cancelar',
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