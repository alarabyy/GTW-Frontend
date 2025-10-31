import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UserService, User } from '../../../../Services/user.service';

@Component({
  selector: 'app-my-profile-user',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './my-profile-user.component.html',
  styleUrls: ['./my-profile-user.component.css']
})
export class MyProfileUserComponent implements OnInit {
  user: User | null = null;
  isLoading = true;
  errorMessage = '';

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.userService.getProfile().subscribe({
      next: (res) => {
        if(res.success){
          this.user = res.content;
        } else {
          this.errorMessage = res.message;
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error loading profile data';
        this.isLoading = false;
      }
    });
  }
}
