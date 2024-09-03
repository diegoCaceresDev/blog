import { Component } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar'; // Importa MatToolbarModule

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatToolbarModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
})
export class FooterComponent {}
