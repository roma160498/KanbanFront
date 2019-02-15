import { Component, OnInit, ViewChild, EventEmitter, Output, Input, ElementRef, SimpleChange } from '@angular/core';
import { MessageService } from 'primeng/components/common/messageservice';
import { TableModule } from 'primeng/table';
import { Issue } from '../../../models/issue';
import { IssueService } from '../../../services/issue.service';

@Component({
	selector: 'app-table-issues',
	templateUrl: './table-issues.component.html',
	styleUrls: ['./table-issues.component.css'],
	providers: [MessageService]
})
export class TableIssuesComponent implements OnInit {

	@ViewChild('table') table: TableModule;
	@Output() selectedIssuesOut: EventEmitter<Issue[]> = new EventEmitter();
	@Input() updatedIssue: any;
	@Input() canGet: boolean;

	amountOfIssues: number;
	cols: any[];
	issues: Issue[] = [];
	scrollHeight: string;
	selectedIssues: Issue[];
	selectedIssue: Issue;
	rowsAmount: number = 25;
	isTableDisplayed: boolean = true;
	searchIsVisible: boolean = true;

	constructor(private issueService: IssueService, private el: ElementRef, private messageService: MessageService) { }

	ngOnInit() {
		this.cols = [
			{ field: 'number', header: 'Issue number' },
			{ field: 'name', header: 'Issue name' },
			{ field: 'feature_number', header: 'Feature number' },
			{ field: 'iteration_number', header: 'Iteration number' },
			{ field: 'classification_name', header: 'Classification' },
			{ field: 'status_name', header: 'Status' },
			{ field: 'team_name', header: 'Team' },
			{ field: 'user_fullname', header: 'Assignee' },
			{ field: 'story_points', header: 'Story Points' },
		];
		this.getIssues(null);
	}

	getIssues(idToSelect) {
		if (this.canGet) {
			this.issueService.getIssue({}).subscribe(issues => {
				this.amountOfIssues = issues.length;
				this.issues = issues;
				debugger;
				if (idToSelect) {
					const issueToSelect = issues.find(el => el.id === idToSelect);
					this.selectedIssues.push(issueToSelect);
					this.selectedIssue = issueToSelect;
					this.onSelectUnselectRow({});					
				}
			});
		}
	}

	_isScrollExist(element): boolean {
		return element.scrollHeight > parseInt(this.scrollHeight);
	}

	rowsAmountChangeHandler(amount, aaa) {
		this.resetTable();
		this.rowsAmount = amount === -1 ? this.amountOfIssues : amount;
	}

	toolbarActionHandler(action, table) {
		switch (action) {
			case 'delete': {
				this._deleteItem(table);
				break;
			}
			case 'refresh': {
				this._refreshGrid(table, null);
				break;
			}
			case 'add': {
				break;
			}
			case 'save': {
				this.selectedIssues = [];
				this.selectedIssuesOut.emit(this.selectedIssues);
				break;
			}
			case 'filter': {
				this.searchIsVisible = !this.searchIsVisible;
				if (!this.searchIsVisible) {
					this.clearFilterInputs();
				}
			}
		}
	}

	ngOnChanges(changes: SimpleChange) {
		if (changes['updatedIssue']) {
			const issue = changes['updatedIssue'];
			if (issue.currentValue && issue.currentValue.isNew) {
				this.issues.push(issue.currentValue.issue);
				this.amountOfIssues++;
				this.resetTable();
				const name = issue.currentValue.issue.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Issue ${name} created successfully.` });
				this._refreshGrid(this.table, issue.currentValue.issue.id);
			}
			if (issue.currentValue && !issue.currentValue.isNew) {
				const updatedIssue = this.issues.find((value, index) => issue.currentValue.issueID == value.id);
				for (let key of Object.keys(issue.currentValue.updatedProps)) {
					if (issue.currentValue.updatedProps[key] !== undefined) {
						updatedIssue[key] = issue.currentValue.updatedProps[key];
					}
				}
				this.resetTable();
				const name = issue.currentValue.updatedProps.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Issue ${name} updated successfully.` });
				this._refreshGrid(this.table, issue.currentValue.issueID);
			}
		}
	}

	onSelectUnselectRow(event) {
		this.selectedIssuesOut.emit(this.selectedIssues);
	}

	_refreshGrid(table, idToSelect) {
		this.getIssues(idToSelect);
		this.clearFilterInputs();
	}

	_deleteItem(table) {
		for (let i = 0; i < this.selectedIssues.length; i++) {
			const arrayIndex = this.issues.indexOf(this.selectedIssues[i]);
			this.issues = this.issues.filter((value, index) => arrayIndex != index);
			const selectedId = this.selectedIssues[i].id;
			this.amountOfIssues--;
			this.selectedIssues
			const name = this.selectedIssues[i].name;
			this.issueService.deleteIssue({ id: selectedId }).subscribe(res => {
				this.resetTable();
				this.showSuccess(name);
			});
		}
		this.selectedIssues = [];
		this.selectedIssuesOut.emit(this.selectedIssues);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `Issue ${name} deleted successfully.` });
	}

	resetTable() {
		this.table['__proto__'].reset.call(this.table);
		this.clearFilterInputs();
	}

	clearFilterInputs() {
		const filters = document.getElementsByClassName('filterInput');
		for (let i = 0; i < filters.length; i++) {
			(<HTMLInputElement>filters[i]).value = '';
			this.table['__proto__'].filter.call(this.table, '', this.cols[i].field);
		}
	}
}
