import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import * as AOS from 'aos';
import { FeedSourceService } from '../../../../Services/feed-source.service';

@Component({
  selector: 'app-feed-sources',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './feed-sources.component.html',
  styleUrls: ['./feed-sources.component.css']
})
export class FeedSourcesComponent implements OnInit {
  sources: any[] = [];
  loading = true;

  constructor(private service: FeedSourceService) {}

  ngOnInit() {
    AOS.init({ duration: 800, once: true });
    this.loadSources();
  }

  /** ✅ تحميل المصادر */
  loadSources() {
    this.service.getAll().subscribe({
      next: (res) => {
        this.sources = res.content ?? []; // لأن الAPI بيرجع { success, content, message }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching sources:', err);
        this.loading = false;
      }
    });
  }

  /** 🗑️ حذف مصدر */
  deleteSource(id: number) {
    if (confirm('Are you sure you want to delete this source?')) {
      this.service.delete(id).subscribe(() => this.loadSources());
    }
  }
}
