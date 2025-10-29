import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FeedService } from '../../../../Services/feed.service';

interface FeedRaw {
  Id: number;
  Title: string;
  Summary?: string;
  Content: string;
  Author?: string;
  Category?: string;
  SourceName?: string;
  Source?: { Title: string };
  PublishedAt?: string;
  ImageUrl?: string;
}

interface FeedMapped {
  id: number;
  title: string;
  description: string;
  author?: string;
  category?: string;
  sourceName?: string;
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
  sections: { category: string; posts: FeedMapped[] }[] = [];

  constructor(private router: Router, private feedService: FeedService) {}

  ngOnInit(): void {
    this.loadFeedsFromBackend();
  }

  loadFeedsFromBackend(): void {
    this.feedService.getAllFeeds().subscribe({
      next: (res: FeedRaw[]) => {
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

  private processFeeds(res: FeedRaw[]): void {
    const mapped: FeedMapped[] = res
      .map(feed => ({
        id: feed.Id,
        title: feed.Title,
        description: feed.Summary || feed.Content,
        author: feed.Author,
        category: feed.Category,
        sourceName: feed.SourceName || feed.Source?.Title || 'Unknown',
        publishedAt: feed.PublishedAt,
        imageUrl: feed.ImageUrl || '',
        logoUrl: this.getSourceLogo(feed.SourceName)
      }))
      .filter(f => f.imageUrl?.trim() !== '');

    const grouped = mapped.reduce((acc: { [key: string]: FeedMapped[] }, feed) => {
      const cat = feed.category || 'General';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(feed);
      return acc;
    }, {});

    this.sections = Object.keys(grouped).map(cat => ({
      category: cat,
      posts: grouped[cat].slice(0, 3)
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
