import { Component } from '@angular/core';
<<<<<<< HEAD
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/shared/navbar/navbar.component';
=======
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
>>>>>>> cdfeec59ca7a141783b903c3730bcec6a04e3ce3

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <router-outlet />
  `,
  styles: []
=======
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
>>>>>>> cdfeec59ca7a141783b903c3730bcec6a04e3ce3
})
export class App {}
