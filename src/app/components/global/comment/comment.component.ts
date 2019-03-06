import { Component, OnInit, Input } from '@angular/core';
import { CommentService } from '../../../services/comment.service';
import { Comment } from '../../../models/comment';
import { DateHelperService } from '../../../services/date-helper.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input() comments;
  @Input() currentUserId;
  @Input() currentIssue;
  @Input() isReply;
  @Input() level;
  @Input() currentUserName;
  @Input() filteredMentionList;
  constructor(private commentService: CommentService, private dateHelper: DateHelperService) { }
  xcoords: any = 0;
  ycoords: any = 0;
  showMentionList: boolean = false;
  mentionListIsActivated: boolean = false;
  valueToFilter: string = '';
  selectedMentionUsers: any[] = [];
  ngOnInit() {
  }

  clickAreaFunction() {
    this.showMentionList = false;
    this.mentionListIsActivated = false;
    this.valueToFilter = '';
  }

  inputAreaFunction(event, control) {
    this.xcoords = control.offsetLeft + 2;
    this.ycoords = control.offsetTop + 2;
    if (event.data === '@') {
      this.showMentionList = true;
      this.mentionListIsActivated = true;
    } else {
      this.showMentionList = false;
    }
  }

  postReplyMessage(parentComment, control) {
    this.checkIsMentionsActual(control);
    const comment = new Comment();
    comment.text = parentComment.replyText;
    comment.issue_id = this.currentIssue.id;
    comment.user_id = this.currentUserId;
    comment.parentComment_id = parentComment.id;
    comment.date = this.dateHelper.getDateTimeFormat(new Date());
    comment.mentions = this.selectedMentionUsers;
    this.commentService.insertComment(comment).subscribe(res => {
      comment.id = res.insertId;
      if (!comment.comments) {
        comment.comments = [];
      }
      parentComment.comments.unshift(comment);
      parentComment.replyText = '';
    });
  }

  checkIsMentionsActual(control) {
    let i = 0;
    while (i < this.selectedMentionUsers.length) {
      const messageText = control.innerText;
      if (messageText.indexOf(this.selectedMentionUsers[i].name) === -1) {
        this.selectedMentionUsers.splice(i, 1);
        continue;
      }
      i++;
    }
  }

  mentionSelected(ev, control) {
    const lastIndex = control.innerText.lastIndexOf('@');
    const offset = window.getSelection().anchorOffset;
    control.innerText = control.innerText.slice(0, lastIndex + 1);
    control.innerText += ev.value.name;
    this.showMentionList = false;
    this.valueToFilter = '';
    this.selectedMentionUsers.push(ev.value);
  }
}
