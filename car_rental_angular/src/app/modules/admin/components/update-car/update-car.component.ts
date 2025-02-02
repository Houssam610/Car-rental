import { Component } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-update-car',
  templateUrl: './update-car.component.html',
  styleUrls: ['./update-car.component.scss']
})
export class UpdateCarComponent {
submitForm() {
throw new Error('Method not implemented.');
}

  carId: number = this.activatedRoute.snapshot.params["id"];
  isSpinning = false;
  imgChanged:boolean = false;
  selectedFile:any;
  imagePreview:string | ArrayBuffer |null = null;
  existingImage: string | null = null;
  updateForm!:FormGroup;
  listOfOptions: Array<{ label: string; value: string }> = [];
  listOfBrands = ["BMW", "AUDI", "MERCEDES", "VOLVO", "VOLKSWAGEN","SEAT"];
  listOfType = ["Petrol", "Hybrid", "Diesel", "Electric", "PHEV"];
  listOfColor = ["Red", "White", "Yellow", "Gray", "Black", "Silver"];
  listOfTransmission = ["Manual", "Automatic"];


  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
    private fb:FormBuilder,
    private message: NzMessageService,
    private router: Router
  ) {}

  ngOnInit() {
    this.updateForm = this.fb.group({
       name: [null, Validators.required],
            brand: [null, Validators.required],
            type: [null, Validators.required],
            color: [null, Validators.required],
            transmission: [null, Validators.required],
            price: [null, Validators.required],
            description: [null, Validators.required],
            year: [null, Validators.required],

    })
    this.getCarById();
  }

  getCarById() {
    this.isSpinning = true;
    this.adminService.getCarById(this.carId).subscribe(
      (res) => {
        //console.log(res);
        this.isSpinning = false;
        const carDto = res;
        this.existingImage = 'data:image/jpeg;base64,' + res.returnedImage;
        console.log(carDto);
        console.log(this.existingImage);
        this.updateForm.patchValue(carDto);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 403) {
          console.error("Access Denied: You do not have permission to access this resource.");
        } else {
          console.error("An error occurred:", error.message);
        }
      }
    );
  }

  updateCar(){
    this.isSpinning = true;
    const token = localStorage.getItem('token'); // Ajoutez ce log
  console.log('Token:', token);
    const formData: FormData = new FormData();
    if(this.imgChanged && this.selectedFile){
      formData.append('image', this.selectedFile, this.selectedFile.name);
    }
    // Ajoute les autres champs du formulaire
    formData.append('brand', this.updateForm.get('brand')?.value);
    formData.append('name', this.updateForm.get('name')?.value);
    formData.append('type', this.updateForm.get('type')?.value);
    formData.append('color', this.updateForm.get('color')?.value);
    formData.append('year', this.updateForm.get('year')?.value);
    formData.append('transmission', this.updateForm.get('transmission')?.value);
    formData.append('description', this.updateForm.get('description')?.value);
    formData.append('price', this.updateForm.get('price')?.value);
  
    // Affiche les données envoyées dans la console
    console.log("FormData content:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  
    // Envoie la requête
    this.adminService.updateCar(this.carId, formData).subscribe(
      (res) => {
        this.isSpinning = false;
        this.message.success("Car updated successfully", { nzDuration: 5000 });
        this.router.navigateByUrl("/admin/dashboard");
      },
      (error) => {
        this.isSpinning = false;
        this.message.error("Error while updating car", { nzDuration: 5000 });
        console.error("Error details:", error); // Affiche les détails de l'erreur
        if (error.error) {
          console.error("Server response:", error.error); // Affiche la réponse du serveur
        }
      }
    );
  }

  onFileSelected(event:any){

  this.selectedFile = event?.target.files[0];
  this.imgChanged = true;
  this.existingImage = null;
  this.previewImage();
  }

  previewImage(){
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    }
    reader.readAsDataURL(this.selectedFile);
  }
}