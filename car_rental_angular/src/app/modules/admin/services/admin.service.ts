import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/auth/services/storage/storage.service';
import { jwtDecode } from 'jwt-decode';
const BASIC_URL = ["http://localhost:8080"];

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) {}

  postCar(carDto: any): Observable<any> {
    const headers = this.createAuthorizationHeader();
    console.log("Headers:", headers); // Affiche les en-têtes dans la console
    return this.http.post(BASIC_URL + "/api/admin/car", carDto, {
      headers: headers
    });
  }


    createAuthorizationHeader(): HttpHeaders {
      const token = StorageService.getToken();
      if (token) {
        const decodedToken: any = jwtDecode(token);
        const expirationDate = new Date(decodedToken.exp * 1000); // Convertit la date d'expiration
        if (expirationDate < new Date()) {
          console.error("Token expired"); // Affiche une erreur si le token est expiré
          // Redirigez l'utilisateur vers la page de connexion
        }
      }

      
    
      let authHeaders: HttpHeaders = new HttpHeaders();
      return authHeaders.set(
        'Authorization',
        'Bearer ' + token
      );
    }

    deleteCar(id:number):Observable<any>{
      return this.http.delete(BASIC_URL+"/api/admin/car/" +id,{
        headers: this.createAuthorizationHeader()
     });
    }

    getCarById(id: number): Observable<any> {
      const headers = this.createAuthorizationHeader();
      console.log("Headers:", headers); // Affiche les en-têtes dans la console
      return this.http.get(BASIC_URL + "/api/admin/car/" + id, {
        headers: headers
      });
    }

    updateCar(carId:number, carDto: any): Observable<any> {
      return this.http.put(BASIC_URL+"/api/admin/car/"+ carId, carDto, {
        headers: this.createAuthorizationHeader()
      });
    }

    getAllCars():Observable<any>{
      return this.http.get(BASIC_URL+"/api/admin/cars",{
        headers: this.createAuthorizationHeader()
      });
    }

    getCarBookings():Observable<any>{
      return this.http.get(BASIC_URL+"/api/admin/car/bookings",{
        headers: this.createAuthorizationHeader()
      });
    }

    changeBookingStatus(bookingId: number, status: string): Observable<any> {
      const url = `${BASIC_URL}/api/admin/car/booking/${bookingId}/${status}`;
      return this.http.get(url, {
        headers: this.createAuthorizationHeader()
      });
    }

    searchCar(searchCarDto: any): Observable<any> {
      return this.http.post(BASIC_URL + "/api/admin/car/search", searchCarDto, {
        headers: this.createAuthorizationHeader()
      });
    }
}
