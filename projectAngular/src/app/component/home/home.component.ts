import { Component, ViewChild } from '@angular/core';
import { TabView } from 'primeng/tabview';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {




  @ViewChild('tabView') tabView!: TabView;

  goToTab(index: number): void {
    if (this.tabView && this.tabView.tabs.length > index) {
      this.tabView.activeIndex = index; // Set the active tab index
    }
  }

}
