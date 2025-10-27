import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-global-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './global-nav.component.html',
  styleUrls: ['./global-nav.component.css']
})
export class GlobalNavComponent {
  isSidebarOpen = false;

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }
}
