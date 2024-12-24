import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isAuthenticated$: Observable<boolean>;

  constructor(
    private apiService: ApiService, // Usa ApiService aquí
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef // Inyecta ChangeDetectorRef
  ) {
    this.isAuthenticated$ = this.apiService.isAuthenticated$; // Usa isAuthenticated$ de ApiService
  }

  ngOnInit(): void {
    this.isAuthenticated$.subscribe((isAuthenticated) => {
      console.log('Authenticated status:', isAuthenticated); // Verifica si este mensaje se imprime // Fuerza la detección de cambios
    });
  }

  logout(): void {
    this.apiService.logout(); // Usa logout de ApiService
    this.router.navigate(['/login']);
    this.snackBar.open('Haz finalizado tu sesion exitosamente. ', 'Cerrar', {
      duration: 5000,
      panelClass: ['green-snackbar'],
    });
  }
}
