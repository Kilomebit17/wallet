import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-between-info',
  templateUrl: './between-info.component.html',
  styleUrls: ['./between-info.component.scss']
})
export class BetweenInfoComponent implements OnInit {
  @Input() title:string | number | undefined
  constructor() { }

  ngOnInit(): void {
  }

}
