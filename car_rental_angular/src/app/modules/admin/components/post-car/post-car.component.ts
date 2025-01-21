import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from '../../services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { every } from 'rxjs';

@Component({
  selector: 'app-post-car',
  templateUrl: './post-car.component.html',
  styleUrls: ['./post-car.component.scss']
})
export class PostCarComponent {
  postCarForm!: FormGroup;
  isSpinning: boolean = false;
  selectedFile: File | null=null;
  imagePreview: string | ArrayBuffer | null =null ; // Initialisation de imagePreview
  listOfOptions: Array<{ label: string; value: string }> = [];
  listOfBrands = ["BMW", "AUDI", "MERCEDES", "VOLVO", "VOLKSWAGEN","SEAT"];
  listOfType = ["Petrol", "Hybrid", "Diesel", "Electric", "PHEV"];
  listOfColor = ["Red", "White", "Yellow", "Gray", "Black", "Silver"];
  listOfTransmission = ["Manual", "Automatic"];

  constructor(private fb: FormBuilder,
    private adminService:AdminService,
    private message:NzMessageService,
    private router: Router) {}

  ngOnInit() {
    this.postCarForm = this.fb.group({
      name: [null, Validators.required],
      brand: [null, Validators.required],
      type: [null, Validators.required],
      color: [null, Validators.required],
      transmission: [null, Validators.required],
      price: [null, Validators.required],
      description: [null, Validators.required],
      year: [null, Validators.required],
    });
  }

  
  postCar() {
    if (this.postCarForm.invalid) {
      this.message.error("Please fill all required fields", { nzDuration: 5000 });
      return;
    }
  
    this.isSpinning = true;
    const formData: FormData = new FormData();
  
    // Ajoute le fichier sélectionné
    if (this.selectedFile) {
      formData.append('image', this.selectedFile, this.selectedFile.name); // Utilisez 'image' au lieu de 'img'
    } else {
      this.message.error("Please select an image", { nzDuration: 5000 });
      this.isSpinning = false;
      return;
    }
  
    // Ajoute les autres champs du formulaire
    formData.append('brand', this.postCarForm.get('brand')?.value);
    formData.append('name', this.postCarForm.get('name')?.value);
    formData.append('type', this.postCarForm.get('type')?.value);
    formData.append('color', this.postCarForm.get('color')?.value);
    formData.append('year', this.postCarForm.get('year')?.value);
    formData.append('transmission', this.postCarForm.get('transmission')?.value);
    formData.append('description', this.postCarForm.get('description')?.value);
    formData.append('price', this.postCarForm.get('price')?.value);
  
    // Affiche les données envoyées dans la console
    console.log("FormData content:");
    formData.forEach((value, key) => {
      console.log(key, value);
    });
  
    // Envoie la requête
    this.adminService.postCar(formData).subscribe(
      (res) => {
        this.isSpinning = false;
        this.message.success("Car posted successfully", { nzDuration: 5000 });
        this.router.navigateByUrl("/admin/dashboard");
      },
      (error) => {
        this.isSpinning = false;
        this.message.error("Error while posting car", { nzDuration: 5000 });
        console.error("Error details:", error); // Affiche les détails de l'erreur
        if (error.error) {
          console.error("Server response:", error.error); // Affiche la réponse du serveur
        }
      }
    );
  }
  
  onFileSelected(event: any) {
    if (event.target.files && event.target.files[0]) {
      this.selectedFile = event.target.files[0];
      console.log("Selected file:", this.selectedFile); // Log le fichier sélectionné
      this.previewImage();
    } else {
      this.selectedFile = null;
      this.imagePreview = null;
      console.log("No file selected"); // Log si aucun fichier n'est sélectionné
    }
  }

 previewImage() {
  if (this.selectedFile) {
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result; // Met à jour l'aperçu de l'image
    };
    reader.readAsDataURL(this.selectedFile); // Lit le fichier et le convertit en URL
  } else {
    this.imagePreview = null; // Réinitialise l'aperçu si aucun fichier n'est sélectionné
  }
}

}
