import { Web3Service } from './../../service/web3/web3.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-my-cards',
  templateUrl: './my-cards.component.html',
  styleUrls: ['./my-cards.component.scss']
})
export class MyCardsComponent implements OnInit {
  constructor(public web3Service:Web3Service) { }

  ngOnInit(): void {
  }
}
