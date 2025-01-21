import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-agency',
  templateUrl: './agency.component.html',
  styleUrls: ['./agency.component.scss']
})
export class AgencyComponent implements OnInit {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Vous pouvez laisser ngOnInit vide ou ajouter d'autres initialisations
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Formulaire soumis :', this.contactForm.value);
      // Envoyez les données à votre backend ici
    }
  }
}