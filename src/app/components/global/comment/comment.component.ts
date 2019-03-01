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
  constructor( private commentService: CommentService, private dateHelper: DateHelperService) { }

  ngOnInit() {
  }

  postReplyMessage(parentComment) {
		const comment = new Comment();
		comment.text = parentComment.replyText;
		comment.issue_id = this.currentIssue.id;
		comment.user_id = this.currentUserId;
    comment.parentComment_id = parentComment.id;
    
		comment.date = this.dateHelper.getDateTimeFormat(new Date());
		this.commentService.insertComment(comment).subscribe(res=> {
      comment.id = res.insertId;
      if (!comment.comments) {
				comment.comments = [];
			}
      parentComment.comments.unshift(comment);
			parentComment.replyText = '';
		});
	}

}
