// src/app/admin/feeds/feeds.component.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Feed } from '../../../../models/feed';
import { FeedService } from '../../../../Services/feed.service';

@Component({
  selector: 'app-feeds',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './feeds.component.html',
  styleUrls: ['./feeds.component.css']
})
export class FeedsComponent {
  feeds: Feed[] = [];
  filtered: Feed[] = [];
  loading = true;
  error: string | null = null;

  searchCtl = new FormControl('');
  category = signal<string>('All');
  displayCount = signal<number>(12);

  placeholderImg = 'assets/image1.png';

  constructor(private feedService: FeedService) {
    this.searchCtl.valueChanges.pipe(debounceTime(250)).subscribe(() => this.applyFilters());
    this.loadFeeds();
  }

  /** ✅ تحميل جميع الأخبار */
  private loadFeeds() {
    this.loading = true;
    this.feedService.getAllFeeds().subscribe({
      next: (res) => {
        this.feeds = res.sort((a: Feed, b: Feed) => {
          const da = a.PublishedAt ? new Date(a.PublishedAt).getTime() : 0;
          const db = b.PublishedAt ? new Date(b.PublishedAt).getTime() : 0;
          return db - da;
        });
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.message ?? 'Failed to load feeds';
        this.loading = false;
      }
    });
  }

  /** ✅ استخراج التصنيفات */
  get categories(): string[] {
    const cats = Array.from(new Set(this.feeds.map(f => f.Category || 'Uncategorized')));
    return ['All', ...cats];
  }

  /** ✅ تطبيق الفلاتر */
  applyFilters() {
    const q = (this.searchCtl.value ?? '').toString().trim().toLowerCase();
    const cat = this.category();
    this.filtered = this.feeds.filter(f => {
      const inCat = cat === 'All' ? true : ((f.Category ?? 'Uncategorized') === cat);
      if (!inCat) return false;
      if (!q) return true;
      const hay = [
        f.Title, f.Summary, f.Content, f.SourceName, f.Author
      ].filter(Boolean).join(' ').toLowerCase();
      return hay.includes(q);
    });
  }

  /** ✅ عند فشل تحميل الصورة */
  onImageError(event: Event) {
    const img = event.target as HTMLImageElement;
    img.src = this.placeholderImg;
  }

  /** ✅ استرجاع صورة الخبر */
  getImageUrl(feed: Feed): string {
    return feed.ImageUrl && feed.ImageUrl.trim() !== '' 
      ? feed.ImageUrl 
      : this.placeholderImg;
  }

  /** ✅ عند اختيار تصنيف جديد */
  setCategory(c: string) {
    this.category.set(c);
    this.applyFilters();
  }

  /** ✅ عرض المزيد */
  showMore() {
    this.displayCount.update(n => n + 12);
  }

  /** ✅ فتح الرابط في نافذة جديدة */
  openExternal(url?: string) {
    if (!url) return;
    window.open(url, '_blank');
  }

  /** ✅ تقصير النص */
  truncate(text?: string | null, len = 140) {
    if (!text) return '';
    return text.length > len ? text.slice(0, len).trim() + '…' : text;
  }
}
