import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-search-car',
  templateUrl: './search-car.component.html',
  styleUrls: ['./search-car.component.scss']
})
export class SearchCarComponent {

  searchCarForm!: FormGroup;
  listOfOptions: Array<{ label: string; value: string }> = [];
  listOfBrands = ["BMW", "AUDI", "MERCEDES", "VOLVO", "VOLKSWAGEN","SEAT"];
  listOfType = ["Petrol", "Hybrid", "Diesel", "Electric", "PHEV"];
  listOfColor = ["Red", "White", "Yellow", "Gray", "Black", "Silver"];
  listOfTransmission = ["Manual", "Automatic"];
  isSpinning = false;
  cars: any = [];


  constructor(private fb:FormBuilder,
    private service: AdminService
  ){
    this.searchCarForm = this.fb.group({
      brand: [null],
      type: [null],
      transmission: [null],
      color: [null],
    })
  }

  searchCar(){
    this.isSpinning = true;
    console.log(this.searchCarForm.value);
    this.service.searchCar(this.searchCarForm.value).subscribe((res) => {
      res.carDtoList.forEach((element: { returnedImage: string, processedImg?: string }) => { // Typage explicite
        element.processedImg = 'data:image/jpeg;base64,' + element.returnedImage; // Ou une image par défaut
        this.cars.push(element);
      });
      this.isSpinning = false;
    })
  }

}
