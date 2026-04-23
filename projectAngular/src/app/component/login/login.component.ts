import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthServiceService } from '../../services/auth-service.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  rememberMe: boolean = false;

  error: string = "";
  err = false;
  email: string = "";
  password: string = "";

  constructor(private authService: AuthServiceService, private router: Router) { }

  onLogin(bypass: boolean) {
    if (bypass = true) {
      this.router.navigate(['/inside']);
    }
    this.authService.login(this.email, this.password).subscribe(response => {
      localStorage.setItem('token', response.token);
      this.router.navigate(['/inside']);
      this.error = "";
      this.err = false;
    }, error => {
      console.error('Login failed', error);
      this.error = "Verifier Vos Champs";
      this.err = true;

    });
  }
  onsignup() { }
}
