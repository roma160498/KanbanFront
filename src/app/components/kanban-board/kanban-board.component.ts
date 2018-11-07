import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit {
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
      iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/add.svg'));
      iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/edit.svg'));
      iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/delete.svg'));
  }
  orderableLists = [['Item 1a', 'Item 2a', 'Item 3a'], ['Item 1b', 'Item 2b', 'Item 3b']]
  ngOnInit() {
  }

}
