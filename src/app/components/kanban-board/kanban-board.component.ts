import { Component, OnInit, ViewChild } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { UserService } from '../../services/user.service';
import { SequenceHelperService } from '../../services/sequence-helper.service';
import { IssueService } from '../../services/issue.service';
import { Issue } from '../../models/issue';
import { IterationService } from '../../services/iteration.service';
//import { MentionConfig } from 'angular-mentions/mention/mention-config';
import { CommentService } from '../../services/comment.service';
import { Comment } from '../../models/comment';
import { DateHelperService } from '../../services/date-helper.service';
import { TeamService } from '../../services/team.service';
import { MessageService } from 'primeng/components/common/messageservice';
@Component({
	selector: 'app-kanban-board',
	templateUrl: './kanban-board.component.html',
	styleUrls: ['./kanban-board.component.css'],
	providers: [MessageService]
})
export class KanbanBoardComponent implements OnInit {
	@ViewChild('sidenav') sidenav: any;
	clickedIssue: any = {};
	availableCars: any[] = [{
		name: 'audi'
	}, {
		name: 'bmw'
	}];
	currentUserId: any = null;
	currentUserName: string = '';
	userBoards: any = [];
	specialTeamBoard: any = [];
	items: string[] = ["Noah", "Liam", "Mason", "Jacob"];
	selectedCars: any[];
	usersList: any = {};
	userFilterId: any = null;
	iterationsList: any = {};
	iterationFilterId: any = null;
	teamsList: any = {};
	teamId: any = null;
	userForMentions: any[] = [];
	filteredMentionList: any[] = [];
	mentionUsers: any = [];
	selectedMentionUsers: any[] = [];
	comments: any[] = [];
	issueToOpenAtFirstInfo: any = null;
	isSpecialTeamTabOpened: boolean = false;
	displayMode: string = 'all';

	draggedIssue: any;
	constructor(private userService: UserService, private sequenceHelper: SequenceHelperService,
	private issueService: IssueService, private iteartionService: IterationService, private commentService: CommentService,
private dateHelper: DateHelperService, private teamService: TeamService, private messageService: MessageService) {

	}
	xcoords: any = 0;
	ycoords: any = 0;
	showMentionList: boolean = false;
	mentionListIsActivated: boolean = false;
	previousKey: string = null;
	valueToFilter: string = '';
	ngOnInit() {
		document.getElementById('messageArea').addEventListener('click', function(event) {
			this.showMentionList = false;
						this.mentionListIsActivated = false;
						this.valueToFilter = '';
		}.bind(this));
		document.getElementById('messageArea').addEventListener('input', function(event) {
			var span = document.createElement("span"); 
			span.appendChild( document.createTextNode("\u200b") /* Zero-width space character */); 
			const range = window.getSelection().getRangeAt(0);
			range.insertNode(span);
			this.xcoords = span.offsetLeft;
			this.ycoords = span.offsetTop+16;
			range.deleteContents();
			if (event.data === '@') {
				this.showMentionList = true;
				this.mentionListIsActivated = true;
			} else {
				this.showMentionList = false;
			}
		}.bind(this));
debugger;
		this.currentUserId = localStorage.getItem('id');
		const login = localStorage.getItem('login');
		const name = localStorage.getItem('userName');
		const surname = localStorage.getItem('userSurname');
		this.currentUserName = login ? name === '' || surname === '' ? login : `${name} ${surname}` : ' ';
		this._initialSetup();
	}

	_initialSetup() {
		this.userService.getKanbanForUser({}, this.currentUserId).subscribe(result => {
			debugger;
			this.userBoards = result;debugger;
			this.teamService.getTeam({}).subscribe(items => {
				debugger;
				this.teamsList.options = items.map(el => {
					return {
						label: el.name,
						value: el.id
					}
				});
				if (this.issueToOpenAtFirstInfo) {
					const team = result.find(el => el.id === this.issueToOpenAtFirstInfo.teamId);
					if (team) {
						for (let stateIndex = 0; stateIndex < team.states.length; stateIndex++) {
							const state = team.states[stateIndex];
							if (state.issues) {
								for (let issueIndex = 0; issueIndex < state.issues.length; issueIndex++) {
									const iss = state.issues[issueIndex];
									if (iss.id === this.issueToOpenAtFirstInfo.issueId) {
										this.clickedIssue = iss;
										this.issueCardClick(iss);
									}	
								}
							}
						}
					} else {
						debugger;
						const teamFromList = this.teamsList.options.filter(el => el.value === this.issueToOpenAtFirstInfo.teamId);
						if (teamFromList) {
							this.teamService.getKanbanBoardForTeam({}, teamFromList[0].value).subscribe(board => {
								this.specialTeamBoard = board;
								for (let stateIndex = 0; stateIndex < board[0].states.length; stateIndex++) {
									const state = board[0].states[stateIndex];
									if (state.issues) {
										for (let issueIndex = 0; issueIndex < state.issues.length; issueIndex++) {
											const iss = state.issues[issueIndex];
											if (iss.id === this.issueToOpenAtFirstInfo.issueId) {
												this.clickedIssue = iss;
												this.issueCardClick(iss);
												this.isSpecialTeamTabOpened = true;
											}	
										}
									}
								}
							})
						}
					}
				}
			});
			
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
			this.userForMentions = this.filteredMentionList= items.map(el => {
				return {
					name: el.name ==='' || el.surname === '' ? el.login : `${el.name} ${el.surname}`,
					id: el.id
				}
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
	// private DEFAULT_CONFIG: MentionConfig = {
	// 	triggerChar: '@',
	// 	labelKey: 'name',
	// 	mentionSelect: (item: any) => this.mentionUsers.push('@' + item.id + item.name)
	//   }
	dragStart(event, issue: any) {
		if (!issue.isClosed) {
			this.draggedIssue = issue;
		}
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
		} else {
			this.messageService.add({ severity: 'info', summary: 'Attention', detail: `Issue state could not be changed because issue is closed.` });	
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
		let showWithMode;
		switch (this.displayMode) {
			case 'all':
				showWithMode = true; 
				break;
			case 'only': 
				showWithMode = issue.isClosed;
				break;
			case 'without': 
				showWithMode = !issue.isClosed;
				break;
		}
		return afterUserFiltering && afterIterationFiltering && showWithMode;
	}
	issueCardClick(issue) {
		this.clickedIssue = issue;
		if (!this.sidenav.isOpen) {
			this.sidenav.open()
		}
		this.showMentionList = false;
		this.mentionListIsActivated = false;
		this.valueToFilter = '';
		this.filteredMentionList = this.userForMentions.slice(0);
		this.issueService.getComments(this.clickedIssue.id).subscribe(items=> {
			debugger;
			this.comments = items;
		})
	}
	closePanel() {
		this.sidenav.close()
		this.clickedIssue = {};
	}
	saveSelection() {
        var sel = window.getSelection(), ranges = [];
        if (sel.rangeCount) {
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                ranges.push(sel.getRangeAt(i));
            }
        }
        return ranges;
	};
	restoreSelection(savedSelection) {
        var sel = window.getSelection();
        sel.removeAllRanges();
        for (var i = 0, len = savedSelection.length; i < len; ++i) {
            sel.addRange(savedSelection[i]);
        }
    };
	mentionSelected(ev) {
		const selection = this.saveSelection();
		debugger;
		const lastIndex = document.getElementById('messageArea').innerText.lastIndexOf('@');
		const offset = window.getSelection().anchorOffset;
		document.getElementById('messageArea').innerText = document.getElementById('messageArea').innerText.slice(0, lastIndex + 1);
		document.getElementById('messageArea').innerText += ev.value.name;
		this.showMentionList = false;
		document.getElementById('messageArea').focus();
		this.valueToFilter = '';
		this.filteredMentionList = this.userForMentions.slice(0);
		this.selectedMentionUsers.push(ev.value);
		this.restoreSelection(selection);
	}
	filterMentionList(key) {
		debugger;
		const regex = new RegExp(`^${key}`, 'i');
		this.filteredMentionList = this.userForMentions.filter((el) =>  regex.test(el.name));
	}
	checkIsMentionsActual() {
		let i = 0;
		while (i < this.selectedMentionUsers.length) {
			const messageText = document.getElementById('messageArea').innerText;
			if (messageText.indexOf(this.selectedMentionUsers[i].name) === -1) {
				this.selectedMentionUsers.splice(i, 1);
				continue;
			}
			i++;
		}
	}
	postMessage() {
		this.checkIsMentionsActual();
		const comment = new Comment();
		comment.text = document.getElementById('messageArea').innerText;
		comment.issue_id = this.clickedIssue.id;
		comment.user_id = this.currentUserId;
		comment.parentComment_id = null;
		comment.user_name = this.currentUserName;
		comment.mentions = this.selectedMentionUsers;
		debugger;
		comment.date = this.dateHelper.getDateTimeFormat(new Date());
		this.commentService.insertComment(comment).subscribe(res=> {
			debugger;
			comment.id = res.insertId;
			if (!comment.comments) {
				comment.comments = [];
			}
			this.comments.unshift(comment);
			document.getElementById('messageArea').innerText = '';
		});
	}
	toolbarButtonsDisabledOptions = {
		isDeleteDisabled: true,
		isEditDisabled: true,
		isSaveDisabled: true,
		isRefreshDisabled: false,
		isRowsDownDisabled: true,
		isAddDisabled: true,
		isFilterDisabled: true
	}
	toolbarActionHandler(event) {
		if (event === 'refresh') {
			this.clickedIssue = {};
			this.comments = [];
			this.userFilterId = null;
			this.iterationFilterId = null;
			this.sidenav.close();
			this.specialTeamBoard = [];
			this.teamId = null;
			this._initialSetup();
		}
	}
	teamSelectHandler(event) {
		debugger;
		this.teamService.getKanbanBoardForTeam({}, event.value).subscribe(items => {

		debugger;
			this.specialTeamBoard = items;
		})
	}

	showHideClosedIssues(event) {
		const isChecked = event.checked;
	}
}