import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-chip',
  templateUrl: './search-chip.component.html',
  styleUrls: ['./search-chip.component.scss']
})
export class SearchChipComponent implements OnInit {
  @Input() searchText = '';
  @Output() remove = new EventEmitter()
  constructor() { }

  ngOnInit(): void {
  }
  onRemove() {
    this.remove.emit();
  }
}
