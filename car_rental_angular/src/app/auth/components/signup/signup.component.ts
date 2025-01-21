import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { NzMessageService} from "ng-zorro-antd/message"
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  isSpinning: boolean = false;
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder,
    private authService :AuthService,
  private message : NzMessageService,
private router:Router )
   {
    this.initializeForm();
  }

  // Initialisation du formulaire
  initializeForm() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }


  // Méthode appelée lors de la soumission
  onSubmit() {
    if (this.signupForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }

    const { password, confirmPassword } = this.signupForm.value;

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Traitement des données du formulaire
    console.log('Form Data:', this.signupForm.value);
        this.authService.register(this.signupForm.value).subscribe((res) => {
      console.log(res);
      if (res.id != null){
        this.message.success("signup succesful",{nzDuration: 5000});
        this.router.navigateByUrl("/login")
      } else {
        this.message.error("Something went wrong",{nzDuration: 5000});
      }
    })
  }
}
