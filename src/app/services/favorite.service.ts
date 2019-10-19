import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'favoriteSensor';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  constructor(private storage: Storage) { }

  getAllFavoriteSensors() {
    return this.storage.get(STORAGE_KEY);
  }
 
  isFavorite(idControl) {
    return this.getAllFavoriteSensors().then(result => {
      return result && result.indexOf(idControl) !== -1;
    });
  }
 
  favoriteSensor(idControl) {
    return this.getAllFavoriteSensors().then(result => {
      if (result) {
        result.push(idControl);
        return this.storage.set(STORAGE_KEY, result);
      } else {
        return this.storage.set(STORAGE_KEY, [idControl]);
      }
    });
  }
 
  unfavoriteFilm(idControl) {
    return this.getAllFavoriteSensors().then(result => {
      if (result) {
        var index = result.indexOf(idControl);
        result.splice(index, 1);
        return this.storage.set(STORAGE_KEY, result);
      }
    });
  }
}
