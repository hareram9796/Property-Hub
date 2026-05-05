import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="container" *ngIf="property; else loading">
      <a routerLink="/properties" class="back-link">← Back to Properties</a>

      <div class="details-layout">
        <!-- LEFT: Gallery -->
        <div class="gallery-col">
          <div class="main-img-wrap">
            <img [src]="activeImg" [alt]="property.title" class="main-img" (error)="onImgErr($event)">
            <span class="badge" [class]="property.status === 'For Sale' ? 'badge-sale' : 'badge-rent'">
              {{ property.status }}
            </span>
          </div>
          <div class="thumbnails">
            <img *ngFor="let img of property.images" [src]="img" [alt]="property.title"
                 class="thumb" [class.active]="img === activeImg"
                 (click)="activeImg = img" (error)="onImgErr($event)">
          </div>
        </div>

        <!-- RIGHT: Info -->
        <div class="info-col">
          <span class="badge badge-type" style="margin-bottom:0.8rem">{{ property.type }}</span>
          <h1>{{ property.title }}</h1>
          <p class="location">📍 {{ property.location }}</p>
          <p class="price">{{ formatPrice(property.price) }}</p>

          <div class="specs-grid">
            <div class="spec" *ngIf="property.bedrooms > 0">
              <span class="spec-icon">🛏</span>
              <span class="spec-val">{{ property.bedrooms }}</span>
              <span class="spec-label">Bedrooms</span>
            </div>
            <div class="spec" *ngIf="property.bathrooms > 0">
              <span class="spec-icon">🚿</span>
              <span class="spec-val">{{ property.bathrooms }}</span>
              <span class="spec-label">Bathrooms</span>
            </div>
            <div class="spec">
              <span class="spec-icon">📐</span>
              <span class="spec-val">{{ property.area }}</span>
              <span class="spec-label">Sq. Ft.</span>
            </div>
          </div>

          <div class="description">
            <h3>About this Property</h3>
            <p>{{ property.description }}</p>
          </div>

          <!-- CTA Buttons -->
          <div class="cta-buttons">
            <a href="tel:+919876543210" class="btn btn-dark">📞 Call Now</a>
            <a [href]="whatsappLink()" target="_blank" class="btn btn-green">💬 WhatsApp</a>
            <button class="btn btn-gold" (click)="showEnquiry = !showEnquiry">📩 Enquire</button>
          </div>

          <!-- Enquiry Form -->
          <div class="enquiry-form" *ngIf="showEnquiry">
            <h3>Send Enquiry</h3>
            <div class="form-group">
              <label>Your Name</label>
              <input type="text" [(ngModel)]="form.name" placeholder="Full name">
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="tel" [(ngModel)]="form.phone" placeholder="+91 98765 43210">
            </div>
            <div class="form-group">
              <label>Message</label>
              <textarea [(ngModel)]="form.message" rows="3" placeholder="I'm interested in this property..."></textarea>
            </div>
            <button class="btn btn-gold btn-block" (click)="submitEnquiry()" [disabled]="submitting">
              {{ submitting ? 'Sending...' : 'Submit Enquiry' }}
            </button>
            <p class="success-msg" *ngIf="submitted">✅ Enquiry sent! We'll contact you shortly.</p>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loading>
      <div class="spinner" style="padding:5rem">Loading property details...</div>
    </ng-template>
  `,
  styles: [`
    .back-link {
      display: inline-block; margin: 1.5rem 0 1rem;
      color: #1a1a2e; font-weight: 600; text-decoration: none;
    }
    .back-link:hover { color: #e8b86d; }

    .details-layout { display: grid; grid-template-columns: 1fr 420px; gap: 2rem; align-items: start; }
    @media (max-width: 900px) { .details-layout { grid-template-columns: 1fr; } }

    .main-img-wrap { position: relative; border-radius: 12px; overflow: hidden; height: 380px; }
    .main-img { width: 100%; height: 100%; object-fit: cover; }
    .badge { position: absolute; top: 14px; left: 14px; }

    .thumbnails { display: flex; gap: 0.6rem; margin-top: 0.8rem; flex-wrap: wrap; }
    .thumb {
      width: 80px; height: 60px; object-fit: cover; border-radius: 8px;
      cursor: pointer; border: 3px solid transparent; transition: border-color 0.2s;
    }
    .thumb.active { border-color: #e8b86d; }
    .thumb:hover { border-color: #e8b86d; }

    .info-col { background: white; border-radius: 12px; padding: 1.8rem; box-shadow: 0 2px 12px rgba(0,0,0,0.08); }
    .info-col h1 { font-size: 1.5rem; color: #1a1a2e; margin-bottom: 0.4rem; }
    .location { color: #888; margin-bottom: 0.8rem; }
    .price { font-size: 2rem; font-weight: 700; color: #e8b86d; margin-bottom: 1.2rem; }

    .specs-grid { display: flex; gap: 1rem; margin-bottom: 1.5rem; flex-wrap: wrap; }
    .spec {
      background: #f8f8f8; border-radius: 10px; padding: 0.8rem 1.2rem;
      text-align: center; flex: 1; min-width: 80px;
    }
    .spec-icon { display: block; font-size: 1.4rem; }
    .spec-val { display: block; font-size: 1.1rem; font-weight: 700; color: #1a1a2e; }
    .spec-label { font-size: 0.75rem; color: #888; }

    .description { margin-bottom: 1.5rem; }
    .description h3 { color: #1a1a2e; margin-bottom: 0.5rem; }
    .description p { color: #666; line-height: 1.7; font-size: 0.93rem; }

    .cta-buttons { display: flex; gap: 0.8rem; flex-wrap: wrap; margin-bottom: 1.5rem; }
    .cta-buttons .btn { flex: 1; text-align: center; }

    .enquiry-form {
      border-top: 2px solid #f0f0f0; padding-top: 1.2rem; margin-top: 0.5rem;
    }
    .enquiry-form h3 { color: #1a1a2e; margin-bottom: 1rem; }
    .success-msg { color: #2d6a4f; font-weight: 600; margin-top: 0.8rem; text-align: center; }
  `]
})
export class PropertyDetailsComponent implements OnInit {
  property: Property | null = null;
  activeImg = '';
  showEnquiry = false;
  submitting = false;
  submitted = false;
  form = { name: '', phone: '', message: '' };

  constructor(private route: ActivatedRoute, private api: ApiService) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.api.getProperty(id).subscribe(p => {
      this.property = p;
      this.activeImg = p.images[0];
    });
  }

  formatPrice(p: number): string {
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(2)} Cr`;
    if (p >= 100000)   return `₹${(p / 100000).toFixed(1)} Lakh`;
    return `₹${p.toLocaleString()}/mo`;
  }

  whatsappLink(): string {
    const msg = `Hi, I'm interested in "${this.property?.title}" at ${this.property?.location}. Please share more details.`;
    return `https://wa.me/${this.property?.whatsapp?.replace('+', '')}?text=${encodeURIComponent(msg)}`;
  }

  submitEnquiry() {
    if (!this.form.name || !this.form.phone) return;
    this.submitting = true;
    this.api.sendEnquiry({
      name: this.form.name,
      phone: this.form.phone,
      property_id: this.property?.id,
      property_title: this.property?.title,
      message: this.form.message
    }).subscribe({
      next: () => { this.submitting = false; this.submitted = true; this.form = { name: '', phone: '', message: '' }; },
      error: () => { this.submitting = false; }
    });
  }

  onImgErr(e: Event) {
    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80';
  }
}
