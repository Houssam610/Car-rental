import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../../app/auth/services/storage/storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  constructor(private router: Router) {}

  // Vérifie si un administrateur est connecté
  isAdminLoggedIn(): boolean {
    return StorageService.isAdminLoggedIn(); // Appel de la méthode statique
  }

  // Vérifie si un client est connecté
  isCustomerLoggedIn(): boolean {
    return StorageService.isCustomerLoggedIn(); // Appel de la méthode statique
  }

  // Déconnecte l'utilisateur
  logout(): void {
    StorageService.logout(); // Appel de la méthode statique
    this.router.navigate(['/login']); // Redirige vers la page de connexion
  }
}