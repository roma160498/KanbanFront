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

	amountOfIssues: number;
	cols: any[];
	issues: Issue[];
	loading: boolean;
	scrollHeight: string;
	selectedIssues: Issue[];
	selectedIssue: Issue;
	rowsAmount: number = 25;
	isTableDisplayed: boolean = true;

	constructor(private issueService: IssueService, private el: ElementRef, private messageService: MessageService) { }

	ngOnInit() {
		this.issueService.getIssueCount({}).subscribe(res => {
			this.amountOfIssues = res[0]['sum'];
		});
		this.cols = [
			{ field: 'number', header: 'Issue number' },
			{ field: 'name', header: 'Issue name' },
			{ field: 'feature_number', header: 'Feature number' },
			{ field: 'iteration_number', header: 'Iteration number' },
			{ field: 'classification_name', header: 'Classification' },
			{ field: 'status_id', header: 'Status' },
			{ field: 'team_name', header: 'Team' },
			{ field: 'user_fullname', header: 'Assignee' },
			{ field: 'story_points', header: 'Story Points' },
		];
		this.loading = true;
	}

	_isScrollExist(element): boolean {
		return element.scrollHeight > parseInt(this.scrollHeight);
	}

	rowsAmountChangeHandler(amount, aaa) {
		this.table['__proto__'].reset.call(this.table);
		this.rowsAmount = amount === -1 ? this.amountOfIssues : amount;
		this.loadIssuesLazy({
			first: 0,
			rows: this.rowsAmount
		});
	}

	toolbarActionHandler(action, table) {
		switch (action) {
			case 'delete': {
				this._deleteItem(table);
				break;
			}
			case 'refresh': {
				this._refreshGrid(table);
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
		}
	}

	ngOnChanges(changes: SimpleChange) {
		if (changes['updatedIssue']) {
			const issue = changes['updatedIssue'];
			if (issue.currentValue && issue.currentValue.isNew) {
				this.issues.push(issue.currentValue.issue);
				this.amountOfIssues++;
				this.table['__proto__'].reset.call(this.table);
				const name = issue.currentValue.issue.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Issue ${name} created successfully.` });
			}
			if (issue.currentValue && !issue.currentValue.isNew) {
				const updatedIssue = this.issues.find((value, index) => issue.currentValue.issueID == value.id);
				for (let key of Object.keys(issue.currentValue.updatedProps)) {
					updatedIssue[key] = issue.currentValue.updatedProps[key];
				}
				this.table['__proto__'].reset.call(this.table);
				const name = issue.currentValue.updatedProps.name;
				this.messageService.add({ severity: 'success', summary: 'Success', detail: `Issue ${name} updated successfully.` });
			}
		}
	}

	onSelectUnselectRow(event) {
		this.selectedIssuesOut.emit(this.selectedIssues);
	}

	_refreshGrid(table) {
		this.issueService.getIssueCount({}).subscribe(res => {
			this.amountOfIssues = res[0]['sum'];
		});
		this.loading = true;
		this.loadIssuesLazy({
			first: table.first,
			rows: this.rowsAmount
		});
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
				this.table['__proto__'].reset.call(this.table);
				this.showSuccess(name);
			});
		}
		this.selectedIssues = [];
		this.selectedIssuesOut.emit(this.selectedIssues);
	}

	showSuccess(name) {
		this.messageService.add({ severity: 'success', summary: 'Success', detail: `Issue ${name} deleted successfully.` });
	}

	loadIssuesLazy(event) {
		this.loading = true;
		this.issueService.getIssue({
			offset: event.first,
			amount: event.rows
		}).subscribe(issues => {
			this.issues = issues;
			this.loading = false;
		});
	}
}
