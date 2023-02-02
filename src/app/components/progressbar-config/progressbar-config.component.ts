import { Component, OnInit } from '@angular/core';
import { NgbProgressbarConfig, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-progressbar-config',
  templateUrl: './progressbar-config.component.html',
  styleUrls: ['./progressbar-config.component.css']
})
export class ProgressbarConfigComponent implements OnInit {

  progress: number = 3;

  constructor(config: NgbProgressbarConfig) {
    config.max = 100;
		config.striped = true;
		config.animated = true;
		config.type = 'success';
		config.height = '10px';
  }

  ngOnInit(): void {
    this.progressTimer();
  }

  progressTimer() {

    setTimeout(() => {
      this.progress = 100
    },
    2000);
  }

}
