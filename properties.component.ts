import { Component, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-properties',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div class="container">
        <h1>All Properties</h1>
        <p>Find your perfect property from our curated listings</p>
      </div>
    </div>

    <div class="container">
      <!-- Filters -->
      <div class="filters-bar">
        <input type="text" [(ngModel)]="f.location" placeholder="Location" (keyup.enter)="applyFilters()">
        <input type="number" [(ngModel)]="f.min_price" placeholder="Min Price (₹)" (keyup.enter)="applyFilters()">
        <input type="number" [(ngModel)]="f.max_price" placeholder="Max Price (₹)" (keyup.enter)="applyFilters()">
        <select [(ngModel)]="f.status">
          <option value="">All Status</option>
          <option value="For Sale">For Sale</option>
          <option value="For Rent">For Rent</option>
        </select>
        <select [(ngModel)]="f.type">
          <option value="">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
          <option value="Commercial">Commercial</option>
        </select>
        <button class="btn btn-gold" (click)="applyFilters()">Filter</button>
        <button class="btn btn-outline" (click)="clearFilters()">Clear</button>
      </div>

      <p class="result-count" *ngIf="properties.length > 0">{{ properties.length }} properties found</p>

      <div class="grid grid-3" *ngIf="properties.length > 0; else empty">
        <div class="card prop-card" *ngFor="let p of properties">
          <div class="prop-img-wrap">
            <img [src]="p.images[0]" [alt]="p.title" class="prop-img" (error)="onImgErr($event)">
            <span class="badge" [class]="p.status === 'For Sale' ? 'badge-sale' : 'badge-rent'">{{ p.status }}</span>
            <span class="badge badge-type type-pill">{{ p.type }}</span>
          </div>
          <div class="prop-body">
            <h3>{{ p.title }}</h3>
            <p class="prop-loc">📍 {{ p.location }}</p>
            <p class="prop-price">{{ formatPrice(p.price) }}</p>
            <div class="prop-meta">
              <span *ngIf="p.bedrooms > 0">🛏 {{ p.bedrooms }}</span>
              <span *ngIf="p.bathrooms > 0">🚿 {{ p.bathrooms }}</span>
              <span>📐 {{ p.area }} sqft</span>
            </div>
            <a [routerLink]="['/properties', p.id]" class="btn btn-dark btn-block" style="margin-top:1rem">
              View Details →
            </a>
          </div>
        </div>
      </div>

      <ng-template #empty>
        <div class="empty-state" *ngIf="!loading">
          <p style="font-size:3rem">🏚️</p>
          <p>No properties match your search. Try different filters.</p>
        </div>
        <div class="spinner" *ngIf="loading">Loading properties...</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .page-header {
      background: linear-gradient(135deg, #1a1a2e, #0f3460);
      color: white; padding: 3rem 2rem;
    }
    .page-header h1 { font-size: 2rem; color: #e8b86d; margin-bottom: 0.4rem; }
    .page-header p { color: rgba(255,255,255,0.7); }

    .filters-bar {
      display: flex; gap: 0.8rem; flex-wrap: wrap;
      background: white; padding: 1.2rem; border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.07); margin-bottom: 1.5rem;
    }
    .filters-bar input, .filters-bar select {
      flex: 1; min-width: 140px; padding: 0.6rem 0.9rem;
      border: 2px solid #e0e0e0; border-radius: 8px; font-size: 0.9rem;
    }
    .filters-bar input:focus, .filters-bar select:focus { outline: none; border-color: #e8b86d; }

    .result-count { color: #777; margin-bottom: 1rem; font-size: 0.9rem; }

    .prop-img-wrap { position: relative; height: 195px; overflow: hidden; }
    .prop-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
    .prop-card:hover .prop-img { transform: scale(1.05); }
    .badge { position: absolute; top: 12px; left: 12px; }
    .type-pill { left: auto; right: 12px; }
    .prop-body { padding: 1.1rem; }
    .prop-body h3 { font-size: 1rem; margin-bottom: 0.3rem; color: #1a1a2e; }
    .prop-loc { color: #888; font-size: 0.83rem; margin-bottom: 0.4rem; }
    .prop-price { font-size: 1.25rem; font-weight: 700; color: #e8b86d; margin-bottom: 0.5rem; }
    .prop-meta { display: flex; gap: 0.8rem; font-size: 0.82rem; color: #666; }
  `]
})
export class PropertiesComponent implements OnInit {
  properties: Property[] = [];
  loading = true;
  f = { location: '', min_price: null as number | null, max_price: null as number | null, status: '', type: '' };

  constructor(private api: ApiService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['location'])  this.f.location  = params['location'];
      if (params['min_price']) this.f.min_price  = +params['min_price'];
      if (params['max_price']) this.f.max_price  = +params['max_price'];
      if (params['status'])    this.f.status     = params['status'];
      this.applyFilters();
    });
  }

  applyFilters() {
    this.loading = true;
    const filters: any = {};
    if (this.f.location)  filters.location  = this.f.location;
    if (this.f.min_price) filters.min_price  = this.f.min_price;
    if (this.f.max_price) filters.max_price  = this.f.max_price;
    if (this.f.status)    filters.status     = this.f.status;
    if (this.f.type)      filters.type       = this.f.type;
    this.api.getProperties(filters).subscribe(p => {
      this.properties = p;
      this.loading = false;
    });
  }

  clearFilters() {
    this.f = { location: '', min_price: null, max_price: null, status: '', type: '' };
    this.applyFilters();
  }

  formatPrice(p: number): string {
    if (p >= 10000000) return `₹${(p / 10000000).toFixed(1)} Cr`;
    if (p >= 100000)   return `₹${(p / 100000).toFixed(1)} L`;
    return `₹${p.toLocaleString()}/mo`;
  }

  onImgErr(e: Event) {
    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80';
  }
}
