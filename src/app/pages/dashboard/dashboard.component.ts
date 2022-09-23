import { Component, OnInit } from '@angular/core';
import { Web3Service } from 'src/app/shared/service/web3/web3.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardPageComponent implements OnInit {

  constructor(private _web3Service:Web3Service) { }

  ngOnInit(): void {
  }
  public getAddress() {
    this._web3Service.getWalletAddress()
  }
  public disconnect() {
    this._web3Service.disconnect()
  }
}
