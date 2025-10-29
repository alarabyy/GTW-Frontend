import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../Services/auth.service';

@Component({
  selector: 'app-global-nav',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './global-nav.component.html',
  styleUrls: ['./global-nav.component.css']
})
export class GlobalNavComponent {
  isSidebarOpen = false;

  constructor(public authService: AuthService) {} // هنا بنخلي السرفيس متاح في التمبلت

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar() {
    this.isSidebarOpen = false;
  }

  logout() {
    this.authService.logout();
    // بعد اللوج اوت ممكن تعمل إعادة توجيه للصفحة الرئيسية
    window.location.href = '/home';
  }
}
