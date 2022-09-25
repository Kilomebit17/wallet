import { MetamaskChainCardIcon, MetamaskChains, MetamaskChainTokenIcons, MetamaskTokens } from './../../interface/my-wallet.interface';
import { Web3Service } from './../../service/web3/web3.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-cards',
  templateUrl: './my-cards.component.html',
  styleUrls: ['./my-cards.component.scss']
})
export class MyCardsComponent implements OnInit {
  coin = '...'
  chainLogo = ''
  cardName = ''
  constructor(public web3Service:Web3Service) {
    this.web3Service.metaMaskTrigger$.subscribe(() => {
      switch (this.web3Service.walletChain) {
        case MetamaskChains.binance:
          this.coin = MetamaskTokens.bnb
          this.chainLogo = MetamaskChainTokenIcons.binance
          this.cardName = MetamaskChains.binance
          break;
        case MetamaskChains.eth:
          this.coin = MetamaskTokens.eth
          this.chainLogo = MetamaskChainTokenIcons.eth
          this.cardName = MetamaskChains.eth
          break;
        default:
          break;
      }
    })
  }

  ngOnInit(): void {
  }
}
