import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importar MatSnackBar
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private http: HttpClient,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.apiService.login(loginData).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.access_token); // Guardar el token

          // Obtener el usuario por email y guardar su ID en localStorage
          this.apiService.getUserByEmail(loginData.email).subscribe(
            (user) => {
              localStorage.setItem('userId', user.id.toString());
              this.snackBar.open('Login exitoso', 'Cerrar', {
                duration: 25000,
                panelClass: ['green-snackbar'],
              });
              this.router.navigate(['/dashboard']);
            },
            (error) => {
              console.error('Error al obtener el usuario', error);
              this.snackBar.open(
                'Error al obtener los datos del usuario.',
                'Cerrar',
                {
                  duration: 5000,
                }
              );
            }
          );
        },
        (error) => {
          console.error('Error en el login', error);
          this.snackBar.open('Email o contraseña incorrectos.', 'Cerrar', {
            duration: 5000,
          });
        }
      );
    }
  }
}
