import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page-header">
      <div class="container">
        <h1>Contact Us</h1>
        <p>Get in touch with our expert agents</p>
      </div>
    </div>

    <div class="container">
      <div class="contact-layout">
        <!-- Form -->
        <div class="contact-form card" style="padding:2rem">
          <h2 style="color:#1a1a2e;margin-bottom:1.5rem">Send an Enquiry</h2>

          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="form.name" placeholder="Your full name">
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input type="tel" [(ngModel)]="form.phone" placeholder="+91 98765 43210">
          </div>
          <div class="form-group">
            <label>Interested In</label>
            <input type="text" [(ngModel)]="form.property_title" placeholder="e.g. 3BHK in Banjara Hills">
          </div>
          <div class="form-group">
            <label>Message</label>
            <textarea [(ngModel)]="form.message" rows="4" placeholder="Tell us what you're looking for..."></textarea>
          </div>

          <button class="btn btn-gold btn-block" (click)="submit()" [disabled]="submitting" style="font-size:1rem;padding:0.8rem">
            {{ submitting ? 'Sending...' : 'Submit Enquiry' }}
          </button>

          <div class="success-box" *ngIf="submitted">
            ✅ Thank you! Our agent will call you within 24 hours.
          </div>
        </div>

        <!-- Info -->
        <div class="contact-info">
          <div class="info-card card" *ngFor="let c of contacts">
            <span class="info-icon">{{ c.icon }}</span>
            <div>
              <h4>{{ c.label }}</h4>
              <p>{{ c.value }}</p>
            </div>
          </div>

          <div class="whatsapp-cta card">
            <h3>Quick Connect</h3>
            <p>Chat with our agent directly on WhatsApp</p>
            <a href="https://wa.me/919876543210?text=Hi, I need help finding a property"
               target="_blank" class="btn btn-green btn-block" style="margin-top:1rem">
              💬 Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-header {
      background: linear-gradient(135deg, #1a1a2e, #0f3460);
      color: white; padding: 3rem 2rem;
    }
    .page-header h1 { font-size: 2rem; color: #e8b86d; margin-bottom: 0.4rem; }
    .page-header p { color: rgba(255,255,255,0.7); }

    .contact-layout { display: grid; grid-template-columns: 1fr 360px; gap: 2rem; align-items: start; }
    @media (max-width: 860px) { .contact-layout { grid-template-columns: 1fr; } }

    .info-card {
      display: flex; align-items: center; gap: 1rem;
      padding: 1.2rem 1.5rem; margin-bottom: 1rem;
    }
    .info-icon { font-size: 2rem; }
    .info-card h4 { color: #1a1a2e; margin-bottom: 0.2rem; }
    .info-card p { color: #777; font-size: 0.9rem; }

    .whatsapp-cta { padding: 1.5rem; text-align: center; }
    .whatsapp-cta h3 { color: #1a1a2e; margin-bottom: 0.4rem; }
    .whatsapp-cta p { color: #777; font-size: 0.9rem; }

    .success-box {
      background: #d4edda; color: #155724;
      padding: 1rem; border-radius: 8px; margin-top: 1rem;
      text-align: center; font-weight: 600;
    }
  `]
})
export class ContactComponent {
  form = { name: '', phone: '', property_title: '', message: '' };
  submitting = false;
  submitted = false;

  contacts = [
    { icon: '📞', label: 'Phone', value: '+91 98765 43210' },
    { icon: '📧', label: 'Email', value: 'info@rgpropertyhub.com' },
    { icon: '📍', label: 'Office', value: 'Banjara Hills, Hyderabad, Telangana' },
    { icon: '🕐', label: 'Hours', value: 'Mon–Sat: 9 AM – 7 PM' },
  ];

  constructor(private api: ApiService) {}

  submit() {
    if (!this.form.name || !this.form.phone) return;
    this.submitting = true;
    this.api.sendEnquiry(this.form).subscribe({
      next: () => { this.submitting = false; this.submitted = true; this.form = { name: '', phone: '', property_title: '', message: '' }; },
      error: () => { this.submitting = false; }
    });
  }
}
