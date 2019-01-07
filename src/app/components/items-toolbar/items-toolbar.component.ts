import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { SelectItem } from 'primeng/api';
import { User } from '../../models/user';


@Component({
	selector: 'app-items-toolbar',
	templateUrl: './items-toolbar.component.html',
	styleUrls: ['./items-toolbar.component.css']
})
export class ItemsToolbarComponent implements OnInit {
	@Input() selectedItems: any[];
	@Input() disabledOptions: any;
	@Input() itemName: string;
	@Input() iconName: string;

	rowsAmountArray: any[] = [{ name: 'All Rows', value: -1 }];
	selectedRowsAmount: any;

	constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
		iconRegistry.addSvgIcon('add', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/add.svg'));
		iconRegistry.addSvgIcon('edit', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/edit.svg'));
		iconRegistry.addSvgIcon('delete', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/delete.svg'));
		iconRegistry.addSvgIcon('refresh', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/refresh.svg'));
		iconRegistry.addSvgIcon('save', sanitizer.bypassSecurityTrustResourceUrl('../../assets/svg/save.svg'));
		for (let i = 0; i < 20; i++) {
			this.rowsAmountArray.push({
				name: i + 1,
				value: i + 1
			});
		}
		this.selectedRowsAmount = this.rowsAmountArray[0];
	}

	@Output() rowsAmountChange: EventEmitter<number> = new EventEmitter();
	@Output() actionClicked: EventEmitter<string> = new EventEmitter();

	public rowsChangedHandler(event) {
		this.rowsAmountChange.emit(this.selectedRowsAmount.value);
	}

	ngOnInit() {
	}

	delete() {
		this.actionClicked.emit('delete');
	}

	refresh() {
		this.actionClicked.emit('refresh');
	}

	add() {
		this.actionClicked.emit('add');
	}

	save() {
		this.actionClicked.emit('save');
	}

	edit() {
		this.actionClicked.emit('edit');
	}
}
