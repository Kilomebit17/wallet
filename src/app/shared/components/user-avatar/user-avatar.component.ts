import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { defaultUserAvatar } from './mock/user-avatar.mock';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit {
  @Input() userAvatar = ''
  @Output() userChangeAvatarEvent = new EventEmitter()
  constructor() { }

  ngOnInit(): void {}

  public changeAvatar():void {
    this.userChangeAvatarEvent.emit()
  }
}
