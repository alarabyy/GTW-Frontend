import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for general Angular directives/logic
import { RouterModule } from '@angular/router'; // Required for routerLink

@Component({
  selector: 'app-global-footer',
  templateUrl: './global-footer.component.html',
  styleUrls: ['./global-footer.component.css'],
  standalone: true,
  // Importing required modules for standalone component
  imports: [CommonModule, RouterModule]
})
export class GlobalFooterComponent {
  // Get the current year dynamically for the copyright
  currentYear: number = new Date().getFullYear();
}
