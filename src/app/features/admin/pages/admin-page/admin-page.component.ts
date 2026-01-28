import { Component } from '@angular/core';
import { RolesPageComponent } from '../roles-page/roles-page.component';

@Component({
  selector: 'app-admin',
  imports: [RolesPageComponent],
  templateUrl: './admin-page.component.html',
  styleUrl: './admin-page.component.scss',
})
export class AdminPageComponent {}
