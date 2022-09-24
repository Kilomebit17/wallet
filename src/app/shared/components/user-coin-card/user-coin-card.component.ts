import { CopyService } from '../../service/buffer-copy/copy.service';
import { Web3Service } from 'src/app/shared/service/web3/web3.service';
import { Component, NgZone, OnInit } from '@angular/core';
import { MetamaskChainCardIcon, MetamaskChains,MetamaskChainTokenIcons } from '../../interface/my-wallet.interface';

@Component({
  selector: 'app-user-coin-card',
  templateUrl: './user-coin-card.component.html',
  styleUrls: ['./user-coin-card.component.scss']
})
export class UserCoinCardComponent implements OnInit {
  public chainLogo = ''
  card = ''

  constructor(
    public web3Service:Web3Service,
    private _copyService:CopyService  
  ) { 
    this.web3Service.walletChainChanged$.subscribe(() => {
      switch (this.web3Service.walletChain) {
        case MetamaskChains.binance:
          this.chainLogo = MetamaskChainTokenIcons.binance
          this.card = MetamaskChainCardIcon.binance
          break;
          case MetamaskChains.eth:
            this.chainLogo = MetamaskChainTokenIcons.eth
            this.card = MetamaskChainCardIcon.eth
          break;
        default:
          break;
      }
    })
  }

  ngOnInit():void {}

  public copy():void {
    this._copyService.copyValue(this.web3Service.walletAddress)
  }

}
