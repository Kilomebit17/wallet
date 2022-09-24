import { CopyService } from './../../service/buffer-copy/copy.service';
import { Web3Service } from 'src/app/shared/service/web3/web3.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-coin-card',
  templateUrl: './user-coin-card.component.html',
  styleUrls: ['./user-coin-card.component.scss']
})
export class UserCoinCardComponent implements OnInit {

  constructor(
    public web3Service:Web3Service,
    private _copyService:CopyService  
  ) { }

  ngOnInit(): void {
  }
  public copy():void {
    this._copyService.copyValue(this.web3Service.walletAddress)
  }
}
