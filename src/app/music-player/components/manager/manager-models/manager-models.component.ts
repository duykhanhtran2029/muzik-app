import { Component, OnInit } from '@angular/core';
import { ChartOptions } from 'chart.js';
import { ManagerModelStore } from './manager-models.store';

interface Model {
  value: string;
  viewValue: string;
  disabled: boolean;
}

@Component({
  selector: 'app-manager-models',
  templateUrl: './manager-models.component.html',
  styleUrls: ['./manager-models.component.scss'],
  providers: [ManagerModelStore],
})
export class ManagerModelsComponent implements OnInit {
  model$ = this.modelStore.model$;
  tagNames: string[] = [];
  title = 'ng2-charts-demo';
  selectedValue: string = 'resnet50';

  models: Model[] = [
    { value: 'resnet50', viewValue: 'Resnet50', disabled: false },
    { value: 'resnet18', viewValue: 'Resnet18', disabled: true },
    { value: 'mobilenet', viewValue: 'MobileNet', disabled: true },
  ];

  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: false,
  };
  public pieChartLabels = [
    'country',
    'dance-viet',
    'edm-viet',
    'electron-dance',
    'k-pop',
    'latin',
    'nhac-dan-ca-que-huong',
    'nhac-phim-us-uk',
    'nhac-phim-viet',
    'nhac-tru-tinh',
    'pop',
    'pop-ballad',
    'R-B-soul',
    'r-b-viet',
    'rap-hiphop',
    'rap-viet',
    'rock',
    'trance-house-techno',
    'v-pop',
  ];
  public pieChartDatasets = [
    {
      data: [
        65, 52, 53, 465, 142, 75, 50, 501, 501, 50, 501, 163, 53, 130, 196, 101,
        43, 138, 501,
      ],
    },
  ];
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor(private modelStore: ManagerModelStore) {}

  ngOnInit(): void {
    this.modelStore.getModelEffect('1');
    this.modelStore.getTagsEffect();
  }
}
