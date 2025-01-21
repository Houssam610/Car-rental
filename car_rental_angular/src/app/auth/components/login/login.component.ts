import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { StorageService } from '../../services/storage/storage.service';
import { sr_RS } from 'ng-zorro-antd/i18n';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // Utiliser l'opérateur de déclaration définie (!)
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private router:Router,
    private message:NzMessageService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      console.log('Login form submitted', this.loginForm.value);
      // Ajoutez ici la logique pour gérer la connexion
      this.authService.login(this.loginForm.value).subscribe((res)=>{
        console.log(res);
        if(res.userId != null){
          const user = {
            id: res.userId,
            role:res.userRole
          }
          StorageService.saveUser(user);
          StorageService.saveToken(res.jwt);
          if(StorageService.isAdminLoggedIn()){
          this.router.navigateByUrl("/admin/dashboard");
          }else if(StorageService.isCustomerLoggedIn()){
            this.router.navigateByUrl("/customer/dashboard");
          }else {
            this.message.error("Bad credentials", { nzDuration: 5000});
          }
        }
    })
  }


  }
}