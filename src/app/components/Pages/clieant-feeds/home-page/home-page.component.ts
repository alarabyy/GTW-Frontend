import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FeedService } from '../../../../Services/feed.service';

interface FeedMapped {
  id: number;
  title: string;
  description: string;
  author?: string;
  category?: string;
  publishedAt?: string;
  imageUrl: string;
  link?: string;
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
  allArticles: FeedMapped[] = [];

  constructor(
    private router: Router,
    private feedService: FeedService
  ) {}

  ngOnInit(): void {
    this.loadFeedsFromBackend();
  }

  /** ✅ Load Feeds from backend with image filter */
  loadFeedsFromBackend(): void {
    this.feedService.getAllFeeds().subscribe({
      next: (res: any[]) => {
        if (!res || res.length === 0) {
          this.loading = false;
          return;
        }

        // 🩵 Map backend fields to frontend fields
        const mapped: FeedMapped[] = res
          .map((feed: any) => ({
            id: feed.Id,
            title: feed.Title,
            description: feed.Summary || feed.Content,
            author: feed.Author,
            category: feed.Category,
            publishedAt: feed.PublishedAt,
            imageUrl: feed.ImageUrl,
            link: feed.Link
          }))
          // ❌ Remove feeds without image
          .filter(f => f.imageUrl && f.imageUrl.trim() !== '');

        // ⬅️ Group feeds by category
        const grouped = mapped.reduce((acc: { [key: string]: FeedMapped[] }, feed: FeedMapped) => {
          const cat = feed.category || 'Other';
          if (!acc[cat]) acc[cat] = [];
          acc[cat].push(feed);
          return acc;
        }, {});

        // ⬅️ Convert grouped data into array for display
        this.sections = Object.keys(grouped).map(cat => ({
          category: cat,
          posts: grouped[cat].slice(0, 3) // 3 news per category
        }));

        this.allArticles = mapped;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error loading feeds:', err);
        this.loading = false;
      }
    });
  }

  /** ✅ Navigate to FeedDetailsComponent */
  openNews(feed: FeedMapped) {
    if (!feed || !feed.id) return;
    this.router.navigate(['/feeds', feed.id]);
  }
}
