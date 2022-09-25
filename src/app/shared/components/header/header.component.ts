import { Web3Service } from './../../service/web3/web3.service';
import { Component, OnInit } from '@angular/core';
import { WalletType } from '../../interface/my-wallet.interface';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private _web3Service:Web3Service
  ) { }

  ngOnInit(): void {
  }

  public connectAccount(event?:string) {
    if(event === WalletType.walletconnect) {
      this._web3Service.trustWalletConnect()
    } 
    if(event === WalletType.metamask) {
      this._web3Service.connectMetamask()
    }
  }
}
