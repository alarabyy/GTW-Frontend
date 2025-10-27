import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NewsService } from '../../../../Services/news.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterModule, CommonModule, HttpClientModule],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  sections: any[] = [];
  allArticles: any[] = []; // 👈 نجمع كل المقالات هنا
  loading = true;

  feeds = [
    { category: 'World', url: 'https://rss.nytimes.com/services/xml/rss/nyt/World.xml' },
    { category: 'Middle East', url: 'https://rss.nytimes.com/services/xml/rss/nyt/MiddleEast.xml' },
    { category: 'Europe', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Europe.xml' },
    { category: 'Asia Pacific', url: 'https://rss.nytimes.com/services/xml/rss/nyt/AsiaPacific.xml' },
    { category: 'Americas', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Americas.xml' },
    { category: 'Africa', url: 'https://rss.nytimes.com/services/xml/rss/nyt/Africa.xml' },
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private newsService: NewsService
  ) {}

  ngOnInit(): void {
    this.loadAllFeeds();
  }

  loadAllFeeds(): void {
    let loaded = 0;

    this.feeds.forEach(feed => {
      this.http.get(feed.url, { responseType: 'text' }).subscribe({
        next: (data) => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(data, 'text/xml');
          const items = Array.from(xml.querySelectorAll('item')).slice(0, 10);

          const posts = items
            .map((item: any, index: number) => {
              const mediaContent = item.getElementsByTagName('media:content')[0];
              const enclosure = item.getElementsByTagName('enclosure')[0];

              let imageUrl = '';
              if (mediaContent && mediaContent.getAttribute('url')) {
                imageUrl = mediaContent.getAttribute('url');
              } else if (enclosure && enclosure.getAttribute('url')) {
                imageUrl = enclosure.getAttribute('url');
              }

              return {
                id: `${feed.category}-${index}`,
                category: feed.category,
                title: item.querySelector('title')?.textContent?.trim() || '',
                description: item.querySelector('description')?.textContent?.replace(/<[^>]*>?/gm, '') || '',
                link: item.querySelector('link')?.textContent?.trim() || '#',
                imageUrl: imageUrl,
                pubDate: item.querySelector('pubDate')?.textContent || ''
              };
            })
            .filter(post => post.imageUrl && post.imageUrl.trim() !== '')
            .slice(0, 3);

          // نحطها في كل سكشن
          this.sections.push({
            category: feed.category,
            posts: posts
          });

          // 👇 كمان نحطها في المصفوفة الكبيرة
          this.allArticles.push(...posts);

          loaded++;
          if (loaded === this.feeds.length) {
            this.newsService.setAllArticles(this.allArticles); // نحفظ كل الأخبار في الخدمة
            this.loading = false;
          }
        },
        error: (err) => {
          console.error(`Error loading ${feed.category}:`, err);
          loaded++;
          if (loaded === this.feeds.length) {
            this.newsService.setAllArticles(this.allArticles);
            this.loading = false;
          }
        }
      });
    });
  }

  openNews(article: any) {
    this.newsService.setArticle(article);
    this.router.navigate(['/news-details']);
  }
}
