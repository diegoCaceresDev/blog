import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../api.service';
import { RegisterDto } from '../models/register.dto';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get firstName() {
    return this.registerForm.get('firstName');
  }

  get lastName() {
    return this.registerForm.get('lastName');
  }

  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const registerData: RegisterDto = {
        nombre: this.registerForm.value.firstName,
        apellido: this.registerForm.value.lastName,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
      };

      this.apiService.register(registerData).subscribe({
        next: (response: any) => {
          const token = response.access_token;
          localStorage.setItem('token', token); // Guarda el token en el localStorage
          // Validar el token
          this.apiService.validateToken(token).subscribe(
            (validationResponse) => {
              if (validationResponse.valid) {
                // Obtén el usuario por email y guarda su ID en el localStorage
                this.apiService.getUserByEmail(registerData.email).subscribe(
                  (user) => {
                    localStorage.setItem('userId', user.id.toString());
                    this.snackBar.open('Registro exitoso', 'Cerrar', {
                      duration: 2500,
                      panelClass: ['green-snackbar'],
                    });
                    this.router.navigate(['/dashboard']); // Redirige al dashboard
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
              } else {
                this.snackBar.open(
                  'Token inválido después del registro',
                  'Cerrar',
                  {
                    duration: 5000,
                  }
                );
              }
            },
            (error) => {
              this.snackBar.open('Error al validar el token', 'Cerrar', {
                duration: 5000,
              });
            }
          );
        },
        error: (err) => {
          this.snackBar.open('Error en el registro', 'Cerrar', {
            duration: 5000,
          });
        },
      });
    }
  }
}
