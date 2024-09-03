import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../api.service';

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
    private router: Router
  ) {
    this.isAuthenticated$ = this.apiService.isAuthenticated$; // Usa isAuthenticated$ de ApiService
  }

  ngOnInit(): void {
    this.isAuthenticated$.subscribe((isAuthenticated) => {});
  }

  logout(): void {
    this.apiService.logout(); // Usa logout de ApiService
    this.router.navigate(['/login']);
  }
}
