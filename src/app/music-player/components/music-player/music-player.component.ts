import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-music-player',
  templateUrl: './music-player.component.html',
  styleUrls: ['./music-player.component.scss']
})
export class MusicPlayerComponent implements OnInit {

  constructor() { }

  lyric = 'Mùi hương hoa diên vĩ \n Hay là hương tóc mềm \n Ngàn vì sao chẳng sáng \n Hơn đôi mắt của em\nThật đẹp đến trăng thẹn thùng\nPhải nấp sau mây\nVậy thì cớ sao\nAnh đây lại nỡ buông tay\nỪ thì anh không muốn\nPhải nấp sau mây\nVậy thì cớ sao\nPhải nấp sau mây\nVậy thì cớ sao Mùi hương hoa diên vĩ Mùi hương hoa diên vĩ Mùi hương hoa diên vĩ Mùi hương hoa diên vĩ \n Hay là hương tóc mềm \n Ngàn vì sao chẳng sáng \n Hơn đôi mắt của em\nThật đẹp đến trăng thẹn thùng\nPhải nấp sau mây\nVậy thì cớ sao\nAnh đây lại nỡ buông tay\nỪ thì anh không muốn\nPhải nấp sau mây\nVậy thì cớ sao\nPhải nấp sau mây\nVậy thì cớ sao';
  ngOnInit(): void {
  }

}
