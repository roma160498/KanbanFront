import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { SequenceHelperService } from '../../services/sequence-helper.service';
import { IssueService } from '../../services/issue.service';
import { Issue } from '../../models/issue';
import { IterationService } from '../../services/iteration.service';

@Component({
	selector: 'app-kanban-board',
	templateUrl: './kanban-board.component.html',
	styleUrls: ['./kanban-board.component.css']
})
export class KanbanBoardComponent implements OnInit {
	availableCars: any[] = [{
		name: 'audi'
	}, {
		name: 'bmw'
	}];
	userBoards: any = [];

	selectedCars: any[];
	usersList: any = {};
	userFilterId: any = null;
	iterationsList: any = {};
	iterationFilterId: any = null;

	draggedIssue: any;
	constructor(private userService: UserService, private sequenceHelper: SequenceHelperService,
	private issueService: IssueService, private iteartionService: IterationService) {

	}
	ngOnInit() {
		const userId = localStorage.getItem('id');
		this.userService.getKanbanForUser({}, userId).subscribe(result => {
			this.userBoards = result;
		});
		this.userService.getUser({}).subscribe(items => {
			this.usersList.list = items;
			this.usersList.options = items.map(el => {
				return {
					label: el.name ==='' || el.surname === '' ? el.login : `${el.name} ${el.surname}`,
					value: el.id
				}
			});
			this.usersList.options.unshift({
				label: 'No user set',
				value: -1
			});
		});
		this.iteartionService.getIteration({}).subscribe(items => {
			this.iterationsList.list = items;
			this.iterationsList.options = items.map(el => {
				return {
					label: `${this.sequenceHelper.getSequenceFor('IT-', 6, el.id)} "${el.name}"`,
					value: el.id
				}
			});
			this.iterationsList.options.unshift({
				label: 'No iteration set',
				value: -1
			});
		});
	}

	dragStart(event, issue: any) {
		this.draggedIssue = issue;
	}

	dragEnd(event) {
		this.draggedIssue = null;
	}

	drop(event, col) {
		console.log(col)
		debugger;
		 if (this.draggedIssue) {
			col.issues.push(this.draggedIssue);
			const team = this.userBoards.filter(el => el.id === this.draggedIssue.teamId);
			const state = team[0].states.filter(el => el.id === this.draggedIssue.stateId);
			const index = state[0].issues.indexOf(this.draggedIssue);
			this.draggedIssue.stateId = col.id;
			state[0].issues.splice(index, 1);
			const updatedIssue = new Issue();
			debugger;
			updatedIssue.status_id = col.id;
			this.issueService.updateIssue(updatedIssue, this.draggedIssue.id).subscribe((result) => {
				
				this.draggedIssue = null;
			});

		}
	}

	findIndex(car: any) {
		let index = -1;
		for (let i = 0; i < this.availableCars.length; i++) {
			if (car.vin === this.availableCars[i].vin) {
				index = i;
				break;
			}
		}
		return index;
	}

	getCardColor(issue) {
		switch (issue.classification) {
			case 1: return 'green';
			case 2:	return 'orange';
			case 3: return 'red';
		}
	}

	getCardTooltip(issue) {
		switch (issue.classification) {
			case 1: return 'Story';
			case 2:	return 'Enabler';
			case 3: return 'Bug';
		}
	}

	userSelectHandler(event) {

	}

	needToDisplayIssueCard(issue) {
		const afterUserFiltering = this.userFilterId ? issue.userId === this.userFilterId || !issue.userId && this.userFilterId === -1 : true;
		const afterIterationFiltering = this.iterationFilterId ? issue.iteration === this.iterationFilterId  || !issue.iteration && this.iterationFilterId === -1 : true;
		return afterUserFiltering && afterIterationFiltering;
	}

}
