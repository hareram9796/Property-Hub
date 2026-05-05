import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="navbar">
      <a class="logo" routerLink="/">🏢 RG Property Hub</a>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact:true}">Home</a>
        <a routerLink="/properties" routerLinkActive="active">Properties</a>
        <a routerLink="/contact" routerLinkActive="active">Contact</a>
      </nav>
    </div>
    <router-outlet></router-outlet>
    <footer>
      <p>&copy; 2026 <span>RG Property Hub</span> — Your Trusted Real Estate Partner</p>
    </footer>
  `,
  styles: [`.active { color: #e8b86d !important; }`]
})
export class AppComponent {}
