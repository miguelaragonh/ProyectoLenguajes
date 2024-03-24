import { Component, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.css']
})
export class LoaderComponent {
  srvLoader = inject(LoaderService);
  isLoading : Subject<boolean> = this.srvLoader.isLoading;
}
