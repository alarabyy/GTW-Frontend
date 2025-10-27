import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';
import { RouterOutlet } from '@angular/router';
import { FeedService } from '../../../../Services/feed.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgChartsModule, RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  // layout
  isSidebarExpanded = true;
  isMobileMenuOpen = false;

  // data
  totalFeeds = 0;
  totalSources = 0;
  recentFeedsCount = 0; // ✅ الجديد هنا
  activeCategoriesCount: { [cat: string]: number } = {};
  topSources: { name: string, count: number }[] = [];
  feedsLast7Days: { date: string, count: number }[] = [];

  // charts
  lineChartData: ChartConfiguration<'line'>['data'] = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { position: 'bottom' } }
  };

  doughnutChartData: ChartConfiguration<'doughnut'>['data'] = { labels: [], datasets: [] };
  doughnutChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right' } }
  };

  loading = true;
  error: string | null = null;

  constructor(private feedService: FeedService) {}

  ngOnInit(): void {
    this.checkScreenSize();
    this.loadFeedsAndCompute();
  }

  @HostListener('window:resize')
  onResize() { this.checkScreenSize(); }

  toggleSidebar() { this.isSidebarExpanded = !this.isSidebarExpanded; }
  toggleMobileMenu() { this.isMobileMenuOpen = !this.isMobileMenuOpen; }

  private checkScreenSize() {
    if (window.innerWidth <= 768) {
      this.isSidebarExpanded = false;
      this.isMobileMenuOpen = false;
    } else {
      this.isSidebarExpanded = true;
      this.isMobileMenuOpen = false;
    }
  }

  private loadFeedsAndCompute() {
    this.loading = true;
    this.feedService.getAllFeeds().subscribe({
      next: (res: any) => {
        const feeds: any[] = Array.isArray(res) ? res : (res?.content ?? []);
        this.computeStatsFromFeeds(feeds);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = err?.message ?? 'Failed to load feeds';
        this.loading = false;
      }
    });
  }

  private computeStatsFromFeeds(feeds: any[]) {
    this.totalFeeds = feeds.length;

    const sourceMap: Record<string, number> = {};
    const catMap: Record<string, number> = {};
    const last7Dates = this.getLastNDates(7).reverse();
    const last7Map: Record<string, number> = {};
    last7Dates.forEach(d => last7Map[d] = 0);

    feeds.forEach(f => {
      const src = f.SourceName ?? (f.SourceUrl ?? 'Unknown');
      sourceMap[src] = (sourceMap[src] || 0) + 1;

      const c = f.Category ?? 'Uncategorized';
      catMap[c] = (catMap[c] || 0) + 1;

      const published = f.PublishedAt ? new Date(f.PublishedAt) : null;
      if (published) {
        const day = this.formatDateKey(published);
        if (day in last7Map) last7Map[day] += 1;
      }
    });

    this.topSources = Object.entries(sourceMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    this.activeCategoriesCount = catMap;
    this.totalSources = Object.keys(sourceMap).length;

    this.feedsLast7Days = last7Dates.map(d => ({ date: d, count: last7Map[d] }));

    // ✅ حساب مجموع آخر 7 أيام هنا بدل ما نحسبه في الـHTML
    this.recentFeedsCount = this.feedsLast7Days.reduce((sum, x) => sum + (x.count || 0), 0);

    this.lineChartData = {
      labels: this.feedsLast7Days.map(x => x.date),
      datasets: [
        {
          data: this.feedsLast7Days.map(x => x.count),
          label: 'Posts (last 7 days)',
          borderColor: '#4c51bf',
          backgroundColor: 'rgba(76,81,191,0.12)',
          fill: 'origin',
          tension: 0.3,
          pointRadius: 4
        }
      ]
    };

    const catLabels = Object.keys(catMap);
    const catValues = catLabels.map(l => catMap[l]);
    this.doughnutChartData = {
      labels: catLabels,
      datasets: [{ data: catValues, label: 'Categories' }]
    };
  }

  private formatDateKey(d: Date) {
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  private getLastNDates(n: number) {
    const arr: string[] = [];
    for (let i = 0; i < n; i++) {
      const dt = new Date();
      dt.setDate(dt.getDate() - i);
      arr.push(this.formatDateKey(dt));
    }
    return arr;
  }
}
