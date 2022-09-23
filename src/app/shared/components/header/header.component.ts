import { Web3Service } from './../../service/web3/web3.service';
import { Component, OnInit } from '@angular/core';

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

  public connectAccount() {
    this._web3Service.connectMetamask()
  }
}
