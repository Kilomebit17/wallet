import { Subscription } from 'rxjs';
import { MetamaskChains, MetamaskChainTokenIcons, MetamaskTokens } from './../../interface/my-wallet.interface';
import { Web3Service } from './../../service/web3/web3.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-cards',
  templateUrl: './my-cards.component.html',
  styleUrls: ['./my-cards.component.scss']
})
export class MyCardsComponent implements OnInit {
  coin = ''
  chainLogo = ''
  metaMaskCardName = ''
  trustWalletCardName = MetamaskChains.twallet

  metaMaskSub$:Subscription = new Subscription()
  constructor(public web3Service:Web3Service) {
    this.metaMaskSub$ && this.metaMaskSub$.unsubscribe()
    this.metaMaskSub$ = this.web3Service.metaMaskTrigger$.subscribe(() => {
      switch (this.web3Service.walletChain) {
        case MetamaskChains.binance:
          this.coin = MetamaskTokens.bnb
          this.chainLogo = MetamaskChainTokenIcons.binance
          this.metaMaskCardName = MetamaskChains.binance
          break;
        case MetamaskChains.eth:
          this.coin = MetamaskTokens.eth
          this.chainLogo = MetamaskChainTokenIcons.eth
          this.metaMaskCardName = MetamaskChains.eth
          break;
        default:
          break;
      }
    })
    this.web3Service.trustWalletTrigger$.subscribe(() => {
      // this.trustWalletCardName = MetamaskChains.twallet
    })
  }

  ngOnInit(): void {
  }
}
