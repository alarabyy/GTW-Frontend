import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from '../../../Services/news.service';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.css']
})
export class NewsDetailsComponent implements OnInit {
  article: any;
  currentIndex: number = 0;
  allArticles: any[] = [];

  constructor(private newsService: NewsService, private router: Router) {}

  ngOnInit(): void {
    this.allArticles = this.newsService.getAllArticles(); // نجلب كل الأخبار
    this.article = this.newsService.getArticle();

    if (this.article) {
      this.currentIndex = this.allArticles.findIndex(a => a.title === this.article.title);
    } else {
      this.router.navigate(['/home']);
    }
  }

  showNext(): void {
    if (this.currentIndex < this.allArticles.length - 1) {
      this.currentIndex++;
      this.article = this.allArticles[this.currentIndex];
      this.newsService.setArticle(this.article);
    }
  }

  showPrevious(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.article = this.allArticles[this.currentIndex];
      this.newsService.setArticle(this.article);
    }
  }
}
