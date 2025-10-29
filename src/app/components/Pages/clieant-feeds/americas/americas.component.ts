import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedService } from '../../../../Services/feed.service';

@Component({
  selector: 'app-americas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './americas.component.html',
  styleUrls: ['./americas.component.css']
})
export class AmericasComponent implements OnInit {
  feeds: any[] = [];
  currentPage = 1;
  pageSize = 9;

  // المصادر اللي تحب تعرض منها الأخبار
  sourceKeys: string[] = ['nbc', 'cnn']; 

  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    this.loadFeeds();
  }

  loadFeeds(): void {
    this.feedService.getFeedsByCategory('Americas', this.sourceKeys).subscribe({
      next: (data: any[]) => this.feeds = data,
      error: (err) => console.error(err)
    });
  }

  get paginatedFeeds(): any[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.feeds.slice(start, start + this.pageSize);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  get totalPages(): number[] {
    return Array(Math.ceil(this.feeds.length / this.pageSize))
      .fill(0)
      .map((_, i) => i + 1);
  }

  openNews(feed: any) {
    if (feed.Link) window.open(feed.Link, '_blank');
    else console.log('Clicked:', feed);
  }
}
