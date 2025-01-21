import { Component } from '@angular/core';
import { CustomerService } from '../../service/customer.service';


interface Car {
  id: number;
  brand: string;
  color: string;
  name: string;
  type: string;
  transmission: string;
  description: string;
  price: string; // Le prix est renvoyé sous forme de chaîne de caractères
  year: string;
  returnedImage: string; // L'image est renvoyée sous forme de chaîne base64
  processedImg?: string; // Optionnel, car il sera ajouté dynamiquement
}
@Component({
  selector: 'app-customer-dashboard',
  templateUrl: './customer-dashboard.component.html',
  styleUrls: ['./customer-dashboard.component.scss']
})
export class CustomerDashboardComponent {
  cars: any = [];

  constructor(private service:CustomerService){}

  ngOnInit(){
    this.getAllCars();

  }

  getAllCars() {
    this.service.getAllCars().subscribe((res: Car[]) => { // Typage de `res`
      console.log(res);
      res.forEach((element: Car) => { // Typage de `element`
        if (element.returnedImage) {
          element.processedImg = 'data:image/jpeg;base64,' + element.returnedImage;
        } else {
          element.processedImg = ''; // Ou une image par défaut
        }
        this.cars.push(element);
      });
    });
  }

}
