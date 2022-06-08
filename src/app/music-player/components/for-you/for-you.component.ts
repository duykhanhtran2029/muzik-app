import { Component, OnInit } from '@angular/core';
import { ForYouStore } from './for-you.store';

@Component({
  selector: 'app-for-you',
  templateUrl: './for-you.component.html',
  styleUrls: ['./for-you.component.scss'],
  providers: [ForYouStore],
})
export class ForYouComponent implements OnInit {
  constructor(private componentStore: ForYouStore) {}
  
  songs$ = this.componentStore.songs$;
  // songs = [
  //   {
  //     image:
  //       'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/c/5/c/8/c5c846fbd38e40dd971b0f7d36470a23.jpg',
  //   },
  //   {
  //     image:
  //       'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/8/4/c/4/84c436b697c9ac4ad9900de45af388a6.jpg',
  //   },
  //   {
  //     image:
  //       'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/e/4/f/0/e4f0c26e1c2bfdacacd5ba3d8042d706.jpg',
  //   },
  //   {
  //     image:
  //       'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/c/3/9/6/c396fd459fbf115fe7f8aee741e0b1de.jpg',
  //   },
  //   {
  //     image:
  //       'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/9/6/d/2/96d2c40a983b85ae4e0d577e34796de5.jpg',
  //   },
  //   {
  //     image:
  //       'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/1/1/8/0/1180ce679c0402b1f800530881d73e2e.jpg',
  //   },
  //   {
  //     image:
  //       'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/8/3/2/3/832349ea644eabd742df5d62a913781a.jpg',
  //   },
  //   {
  //     image:
  //       'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/2/4/8/6/2486d1faa0e8cfcca01c39b5814113f2.jpg',
  //   },
  //   {
  //     image:
  //       'https://photo-resize-zmp3.zadn.vn/w240_r1x1_jpeg/cover/8/0/6/7/80677a86fdcee35d96f0047c7addcc7c.jpg',
  //   },
  //   {
  //     image:
  //       'https://photo-resize-zmp3.zadn.vn/w640_r1x1_jpeg/cover/9/6/d/2/96d2c40a983b85ae4e0d577e34796de5.jpg',
  //   },
  // ];
  ngOnInit(): void {
    this.componentStore.getSongsEffect();
  }
}
