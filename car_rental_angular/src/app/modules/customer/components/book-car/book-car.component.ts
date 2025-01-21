import { Component } from '@angular/core';
import { CustomerService } from '../../service/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageService } from 'src/app/auth/services/storage/storage.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { jwtDecode } from 'jwt-decode';

@Component({
    selector: 'app-book-car',
    templateUrl: './book-car.component.html',
    styleUrls: ['./book-car.component.scss']
})
export class BookCarComponent {

    carId: number = this.activatedRoute.snapshot.params["id"];
    car: any;
    processedImage: any;
    validateForm!: FormGroup;
    isSpinning = false;
    dateFormat!: "DD-MM-YYYY";

    constructor(
        private service: CustomerService,
        private activatedRoute: ActivatedRoute,
        private fb: FormBuilder,
        private message: NzMessageService,
        private router: Router
    ) { }

    ngOnInit() {
      this.validateForm = this.fb.group({
          toDate: [null, [Validators.required, this.validateDate]],
          fromDate: [null, [Validators.required, this.validateDate]],
      });
      this.getCarById();
  }
  
  validateDate(control: any) {
      const date = new Date(control.value);
      return !isNaN(date.getTime()) ? null : { invalidDate: true };
  }

    getCarById() {
        this.service.getCarById(this.carId).subscribe((res) => {
            console.log(res);
            this.processedImage = 'data:image/jpeg;base64, ' + res.returnedImage;
            this.car = res;
        });
    }

    bookACar(data: any) {
      const token = StorageService.getToken();
      if (!token) {
          this.message.error("No token found. Please log in again.");
          this.router.navigateByUrl("/login");
          return;
      }
  
      const decodedToken: any = jwtDecode(token);
      const expirationDate = new Date(decodedToken.exp * 1000);
      if (expirationDate < new Date()) {
          this.message.error("Your session has expired. Please log in again.");
          this.router.navigateByUrl("/login");
          return;
      }
  
      this.isSpinning = true;
      const bookACarDto = {
          toDate: data.toDate.toISOString(), // Convertit en format ISO
          fromDate: data.fromDate.toISOString(), // Convertit en format ISO
          userId: StorageService.getUserId(),
          carId: this.carId
      };
  
      this.service.bookACar(bookACarDto).subscribe(
          (res) => {
              console.log(res);
              this.message.success("Booking request submitted successfully", { nzDuration: 5000 });
              this.router.navigateByUrl("/customer/dashboard");
          },
          (error) => {
              this.isSpinning = false;
              this.message.error("Something went wrong", { nzDuration: 5000 });
          }
      );
  }
}