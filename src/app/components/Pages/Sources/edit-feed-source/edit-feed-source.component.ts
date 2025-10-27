import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedSourceService } from '../../../../Services/feed-source.service';

@Component({
  selector: 'app-edit-feed-source',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-feed-source.component.html',
  styleUrls: ['./edit-feed-source.component.css']
})
export class EditFeedSourceComponent implements OnInit {
  form!: FormGroup;
  id!: number;
  loading = true;
  saving = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private service: FeedSourceService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));
    this.form = this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required]
    });

    this.loadSource();
  }

  /** ✅ تحميل البيانات من الـ API */
  loadSource() {
    this.service.getAll().subscribe({
      next: (res) => {
        const sources = res.content || []; // 👈 تعديل هنا
        const source = sources.find((s: any) => s.id === this.id);
        if (source) this.form.patchValue(source);
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  /** 💾 حفظ التعديلات */
  save() {
    if (this.form.invalid) return;

    this.saving = true;
    this.service.update(this.id, this.form.value).subscribe({
      next: () => {
        this.saving = false;
        alert('✅ Source updated successfully!');
        this.router.navigate(['/feed-sources']);
      },
      error: (err) => {
        this.saving = false;
        console.error(err);
        alert('❌ Failed to update source');
      }
    });
  }
}
