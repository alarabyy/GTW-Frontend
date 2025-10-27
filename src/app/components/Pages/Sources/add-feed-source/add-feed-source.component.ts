import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedSourceService } from '../../../../Services/feed-source.service';

@Component({
  selector: 'app-add-feed-source',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-feed-source.component.html',
  styleUrls: ['./add-feed-source.component.css']
})
export class AddFeedSourceComponent {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private service: FeedSourceService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      url: ['', [Validators.required]],
      sections: this.fb.array([
        this.fb.group({
          name: ['', Validators.required],
          slang: ['', Validators.required]
        })
      ])
    });
  }

  /** ✅ Get the sections as FormArray */
  get sections(): FormArray {
    return this.form.get('sections') as FormArray;
  }

  /** ➕ Add new section input */
  addSection() {
    this.sections.push(
      this.fb.group({
        name: ['', Validators.required],
        slang: ['', Validators.required]
      })
    );
  }

  /** ❌ Remove a section */
  removeSection(index: number) {
    if (this.sections.length > 1) {
      this.sections.removeAt(index);
    }
  }

  /** 💾 Save feed source */
  save() {
    if (this.form.invalid) return;
    this.loading = true;

    this.service.create(this.form.value).subscribe({
      next: (res) => {
        this.loading = false;
        alert('✅ ' + (res.message || 'Source added successfully!'));
        this.router.navigate(['/feed-sources']);
      },
      error: (err) => {
        this.loading = false;
        console.error(err);
        alert('❌ Failed to add source: ' + (err.error?.message || 'Unknown error'));
      }
    });
  }
}
