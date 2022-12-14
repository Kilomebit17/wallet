
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { WalletType } from 'src/app/shared/interface/my-wallet.interface';
import { Web3Service } from 'src/app/shared/service/web3/web3.service';
import { defaultUserAvatar, UserAvatars } from '../../../user-avatar/mock/user-avatar.mock';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit {
  public userAvatar = defaultUserAvatar
  @Output() connectWalletEvent = new EventEmitter()
  constructor(public web3Service:Web3Service) { }

  ngOnInit(): void {
    this._init()
  }
  public userRandomizeAvatar():void {
    this.userAvatar = UserAvatars[Math.floor(Math.random() * UserAvatars.length)]
  }
  public walletConnect():void {
    this.connectWalletEvent.emit(WalletType.walletconnect)

  }
  public metamaskConnect():void {
    this.connectWalletEvent.emit(WalletType.metamask)
  }
  private _init() {}
  
}
