import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './productoverview.component.html',
})
export class ProductOverviewComponent implements OnInit {
    
    color = 'bluegray';

    size = 'M';

    liked = false;

    images: string[] = [];

    selectedImageIndex = 0;

    quantity = 1;
          
    ngOnInit(): void {
      this.images = [
          'product-overview-3-1.png',
          'product-overview-3-2.png',
          'product-overview-3-3.png',
          'product-overview-3-4.png'
      ];
    }
}
