import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedDetail } from '../../../../models/FeedDetails';

@Component({
  selector: 'app-news-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './news-details.component.html',
  styleUrls: ['./news-details.component.css']
})
export class NewsDetailsComponent implements OnInit {
  @Input() feed!: FeedDetail;    
  @Input() goBack!: () => void;  

  formattedDate: string = '';
  primaryContent: string = ''; 

  ngOnInit(): void {
    // تنسيق التاريخ
    const dateStr = this.feed.PublishedAt || this.feed.PubDate;
    if (dateStr) {
      this.formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }

    // تنظيف المحتوى واستخراج المحتوى الرئيسي
    this.primaryContent = this.getCleanContent(this.feed);
  }

  getCleanContent(feed: FeedDetail): string {
    // إذا كان هناك محتوى
    let content = feed.Content || '';
    
    // تحقق من وجود RAW DATA
    const rawDataSeparator = '--- RAW DATA ---';
    if (content.includes(rawDataSeparator)) {
      // استخراج ما قبل RAW DATA
      content = content.substring(0, content.indexOf(rawDataSeparator)).trim();

      // إذا لم يكن هناك محتوى قبل RAW DATA، استخدم المحتوى من JSON المضمن
      if (!content) {
        try {
          const rawJsonStr = feed.Content?.split(rawDataSeparator)[1]?.trim();
          if (rawJsonStr) {
            const rawObj = JSON.parse(rawJsonStr);
            content = rawObj.description || rawObj.content || '';
          }
        } catch (e) {
          console.warn('Failed to parse RAW DATA', e);
        }
      }
    }

    return content;
  }

  get originalLink(): string | null | undefined {
    return this.feed.Link || this.feed.Guid;
  }
}
