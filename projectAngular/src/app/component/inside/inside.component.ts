import { Component } from '@angular/core';

@Component({
  selector: 'app-inside',
  templateUrl: './inside.component.html',
  styleUrl: './inside.component.scss'
})
export class InsideComponent {
  sidebarExpanded: boolean = true;

  onSidebarToggle(expanded: boolean) {
    this.sidebarExpanded = expanded; // Update state based on sidebar toggle
  }
}
