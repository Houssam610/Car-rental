import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CustomerService } from '../../service/customer.service';

@Component({
  selector: 'app-search-car',
  templateUrl: './Find-car.component.html',
  styleUrls: ['./Find-car.component.scss']
})
export class FindCarComponent {
  searchCarForm!: FormGroup;
  listOfOptions: Array<{ label: string; value: string }> = [];
  listOfBrands = ["BMW", "AUDI", "MERCEDES", "VOLVO", "VOLKSWAGEN","SEAT"];
  listOfType = ["Petrol", "Hybrid", "Diesel", "Electric", "PHEV"];
  listOfColor = ["Red", "White", "Yellow", "Gray", "Black", "Silver"];
  listOfTransmission = ["Manual", "Automatic"];
  isSpinning = false;
  cars: any = [];


  constructor(private fb:FormBuilder,
    private service: CustomerService
  ){
    this.searchCarForm = this.fb.group({
      brand: [null],
      type: [null],
      transmission: [null],
      color: [null],
    })
  }

  searchCarnew() {
    this.isSpinning = true;
    console.log(this.searchCarForm.value);
    this.service.searchCarnew(this.searchCarForm.value).subscribe(
      (res) => {
        res.carDtoList.forEach((element: { returnedImage: string, processedImg?: string }) => {
          element.processedImg = 'data:image/jpeg;base64,' + element.returnedImage;
          this.cars.push(element);
        });
        this.isSpinning = false;
      },
      (error) => {
        console.error('Error searching cars:', error); // Affichez l'erreur dans la console
        this.isSpinning = false;
      }
    );
  }

}
