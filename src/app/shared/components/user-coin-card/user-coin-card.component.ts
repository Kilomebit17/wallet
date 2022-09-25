import { CopyService } from '../../service/buffer-copy/copy.service';
import { Web3Service } from 'src/app/shared/service/web3/web3.service';
import { Component, Input,  OnInit } from '@angular/core';
import { MetamaskChains } from '../../interface/my-wallet.interface';

@Component({
  selector: 'app-user-coin-card',
  templateUrl: './user-coin-card.component.html',
  styleUrls: ['./user-coin-card.component.scss']
})
export class UserCoinCardComponent implements OnInit {
  @Input() chainLogo:string | undefined
  @Input() cardName = ''
  @Input() cardAddress?:string = ''
  @Input() isDisconnect:boolean = true
  constructor(
    public web3Service:Web3Service,
    private _copyService:CopyService,
  ) { 
   
  }

  ngOnInit():void {}

  public copy(cardAddress:any):void {
    if(cardAddress === MetamaskChains.binance) {
      this._copyService.copyValue(this.web3Service.metaMaskWalletAddress)
    }
    if(cardAddress === MetamaskChains.twallet) {
      this._copyService.copyValue(this.web3Service.trustWalletAddress)
    }
  }
  
  public walletDisconnect() {
    this.web3Service.trustWalletDisconnect()
  }

}
