import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  selector: 'pem-select-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pem-select-list.component.html',
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PemSelectListComponent<T extends { id: string; name: string }> {
  @Input() items: T[] = [];
  @Input() selectedItem: T | undefined = undefined;
  @Output() itemClick = new EventEmitter<T>();

  onItemClick(item: T) {
    this.itemClick.emit(item);
  }

  getItemBackgroundColor(item: T): string {
    return item.id === this.selectedItem?.id ? 'bg-slate-200' : 'bg-white';
  }
}
