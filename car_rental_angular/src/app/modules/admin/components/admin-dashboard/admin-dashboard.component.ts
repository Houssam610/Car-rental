import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';

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
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent {

  cars: any = [];

  constructor(private adminService: AdminService,
    private message: NzMessageService
  ){}

  ngOnInit(){
    this.getAllCars();

  }

  getAllCars() {
    this.adminService.getAllCars().subscribe((res: Car[]) => { // Typage de `res`
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

  deleteCar(id: number){
    console.log(id);
    this.adminService.deleteCar(id).subscribe((res)=>{
      this.getAllCars();
      this.message.success("Car deleted successfully", {nzDuration: 5000});
    })

  }

}
