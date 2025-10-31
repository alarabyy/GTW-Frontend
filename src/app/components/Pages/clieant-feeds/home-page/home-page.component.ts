import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FeedService } from '../../../../Services/feed.service';
import { Feed } from '../../../../models/feed';

interface FeedMapped {
  id: number;
  title: string;
  description: string;
  author?: string;
  category?: string;
  sourceName: string;
  publishedAt?: string;
  imageUrl: string;
  logoUrl?: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  loading = true;
  sections: { sourceName: string; posts: FeedMapped[] }[] = [];

  constructor(private router: Router, private feedService: FeedService) {}

  ngOnInit(): void {
    this.loadFeedsFromBackend();
  }

  loadFeedsFromBackend(): void {
    this.feedService.getAllFeeds().subscribe({
      next: (res: Feed[]) => {
        if (!res?.length) {
          this.loading = false;
          return;
        }
        this.processFeeds(res);
        this.loading = false;
      },
      error: err => {
        console.error('❌ Error loading feeds:', err);
        this.loading = false;
      }
    });
  }

  private processFeeds(res: Feed[]): void {
    const mapped: FeedMapped[] = res
      .map(feed => ({
        id: feed.Id || 0,
        title: feed.Title,
        description: feed.Summary || feed.Content || '',
        author: feed.Author || '',
        category: feed.Category || '',
        sourceName: feed.SourceName || 'Unknown',
        publishedAt: feed.PublishedAt || '',
        imageUrl: feed.ImageUrl || '',
        // إصلاح الخطأ: تحويل null إلى undefined
        logoUrl: this.getSourceLogo(feed.SourceName ?? undefined)
      }))
      .filter(f => f.imageUrl.trim() !== '');

    const grouped = mapped.reduce((acc: { [key: string]: FeedMapped[] }, feed) => {
      const source = feed.sourceName || 'Unknown';
      if (!acc[source]) acc[source] = [];
      acc[source].push(feed);
      return acc;
    }, {});

    this.sections = Object.keys(grouped).map(source => ({
      sourceName: source,
      posts: grouped[source].slice(0, 3) // عرض 3 كروت لكل مصدر
    }));
  }

  getSourceLogo(source?: string): string {
    if (!source) return '/assets/logos/default-news.png';
    const name = source.toLowerCase();
    if (name.includes('bbc')) return '/assets/logos/bbc.png';
    if (name.includes('cnn')) return '/assets/logos/cnn.png';
    if (name.includes('aljazeera')) return '/assets/logos/aljazeera.png';
    if (name.includes('reuters')) return '/assets/logos/reuters.png';
    return '/assets/logos/default-news.png';
  }

  openNews(feed: FeedMapped) {
    this.router.navigate(['/feeds', feed.id]);
  }

  scrollToNews() {
    const element = document.getElementById('news-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  }
}
