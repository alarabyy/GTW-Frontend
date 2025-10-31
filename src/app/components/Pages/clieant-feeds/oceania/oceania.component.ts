import { Component } from '@angular/core';
import { FeedService } from '../../../../Services/feed.service';
import { CommonModule } from '@angular/common';
import { NewsDetailsComponent } from '../news-details/news-details.component';

@Component({
  selector: 'app-oceania',
  standalone: true,
  imports: [CommonModule, NewsDetailsComponent],
  templateUrl: './oceania.component.html',
  styleUrl: './oceania.component.css'
})
export class OceaniaComponent {
feeds: any[] = [];
  selectedFeed: any = null; // الخبر المختار
  currentPage = 1;
  pageSize = 9;
  categoryId = 5; // رقم الكاتيجوري لأمريكا حسب API

  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    this.loadFeeds();
  }

  loadFeeds(): void {
    this.feedService.getFeedsByCategory(this.categoryId).subscribe({
      next: (data: any[]) => this.feeds = data,
      error: (err) => console.error(err)
    });
  }

  get paginatedFeeds(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.feeds.slice(start, start + this.pageSize);
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.feeds.length / this.pageSize))
      .fill(0)
      .map((_, i) => i + 1);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  openDetails(feed: any) {
    this.selectedFeed = feed;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goBack() {
    this.selectedFeed = null; // العودة لقائمة الأخبار
  }
}
