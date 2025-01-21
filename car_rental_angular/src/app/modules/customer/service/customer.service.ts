import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Observable, throwError } from 'rxjs';
import { StorageService } from 'src/app/auth/services/storage/storage.service';


const BASIC_URL = ["http://localhost:8080"];

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpClient) { }

  getAllCars():Observable<any>{
        return this.http.get(BASIC_URL+"/api/customer/cars",{
          headers: this.createAuthorizationHeader()
        });
      }

 getCarById(carId: number):Observable<any>{
        return this.http.get(BASIC_URL+"/api/customer/car/" + carId,{
          headers: this.createAuthorizationHeader()
        });
      }

  bookACar(bookACarDto: any): Observable<any> {
        return this.http.post(BASIC_URL + "/api/customer/car/book", bookACarDto, {
            headers: this.createAuthorizationHeader()
        });
    }

  getBookingsByUserId():Observable<any>{
      return this.http.get(BASIC_URL+"/api/customer/car/bookings/" + StorageService.getUserId(),{
        headers: this.createAuthorizationHeader()
      });
    }  

  searchCarnew(searchCarDto: any): Observable<any> {
        return this.http.post(BASIC_URL + "/api/customer/car/searchcar", searchCarDto, {
          headers: this.createAuthorizationHeader()
        });
      }


  createAuthorizationHeader(): HttpHeaders {
      const token = StorageService.getToken();
  
      // Si le token est manquant
      if (!token) {
          console.error("No token found"); // Affiche une erreur si aucun token n'est trouvé
          // Redirigez l'utilisateur vers la page de connexion ou gérez cette situation
          return new HttpHeaders(); // Retourne des en-têtes vides
      }
  
      // Vérifie si le token est expiré
      const decodedToken: any = jwtDecode(token);
      const expirationDate = new Date(decodedToken.exp * 1000); // Convertit la date d'expiration
      if (expirationDate < new Date()) {
          console.error("Token expired"); // Affiche une erreur si le token est expiré
          // Redirigez l'utilisateur vers la page de connexion ou gérez cette situation
          return new HttpHeaders(); // Retourne des en-têtes vides
      }
  
      // Si le token est valide, retourne les en-têtes avec le token
      return new HttpHeaders().set('Authorization', 'Bearer ' + token);
  }

}
