import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  slides = [
    {'image': 'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/7/7/1/9/771952620070edb088442430b60ea681.jpg'}, 
    {'image': 'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/0/9/b/c/09bca488ac9c4ba750120cbf37288f68.jpg'},
    {'image': 'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/e/4/d/c/e4dce0d4ae15c688e2cd8b1934902380.jpg'}, 
    {'image': 'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/2/0/c/8/20c8208e735601981e8d3b85b3d4cacd.jpg'}, 
    {'image': 'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/9/6/d/2/96d2c40a983b85ae4e0d577e34796de5.jpg'}
  ];

}
