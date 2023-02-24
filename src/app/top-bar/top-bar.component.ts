import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Subscription, fromEvent, BehaviorSubject, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
} from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
  isHidden?: boolean;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
})
export class BreadcrumbComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() breadcrumbLinks = BR;

  @ViewChild('breadcrumbContainer', { static: false })
  breadcrumbContainer: ElementRef;

  breadcrumbsList$ = new Observable<Breadcrumb[]>();

  private resizeSubscription: Subscription;

  private _width$ = new BehaviorSubject<number>(0);
  private _observer: ResizeObserver = new ResizeObserver((entries) => {
    this._width$.next(entries[0].contentRect.width);
  });

  constructor() {}

  ngOnInit() {
    this.breadcrumbsList$ = this._width$.pipe(
      debounceTime(100),
      startWith(1000),
      map((width: number) => this._checkFitting(width)),
      distinctUntilChanged()
    );
  }

  private _checkFitting(width: number) {
    console.log(width);
    const breadcrumbLinks: HTMLElement[] = Array.from(
      this.breadcrumbContainer?.nativeElement.querySelectorAll('a') || []
    );
    // console.log('breadcrumbLinks', breadcrumbLinks);

    const currentLink: HTMLElement[] = breadcrumbLinks.splice(-1);
    const homeLink: HTMLElement[] = breadcrumbLinks.splice(1, 1);
    // console.log('currentLink', currentLink);
    // console.log('homeLink', homeLink);
    // console.log('breadcrumbLinks 2', breadcrumbLinks);

    let allWidth: number =
      currentLink[0]?.offsetWidth + homeLink[0]?.offsetWidth;

    const notFit: any[] = [];
    for (let link of breadcrumbLinks) {
      if (allWidth + link.offsetWidth > width) {
        notFit.push(link);
      }
      allWidth += link.offsetWidth;
    }

    console.log(notFit);

    return BR;
  }

  ngAfterViewInit(): void {
    this._observer.observe(this.breadcrumbContainer.nativeElement);
  }

  ngOnDestroy(): void {
    this._observer.unobserve(this.breadcrumbContainer.nativeElement);
  }

  private handleResize(): void {
    // const breadcrumbLinks: HTMLElement[] =
    //   this.breadcrumbContainer?.nativeElement.querySelectorAll('a') || [];
    // const breadcrumbContainerWidth: number =
    //   this.breadcrumbContainer?.nativeElement.offsetWidth;
    // console.dir('breadcrumbContainer', this.breadcrumbContainer);
    // console.log('breadcrumbContainerWidth', breadcrumbContainerWidth);
    // let totalLinkWidth: number = 0;
    // let linksToHide: HTMLElement[] = [];
    // for (const breadcrumbLink of breadcrumbLinks) {
    //   const linkWidth: number = breadcrumbLink.offsetWidth;
    //   console.log('linkWidth', linkWidth);
    //   // if (totalLinkWidth + linkWidth > breadcrumbContainerWidth) {
    //   //   linksToHide.push(breadcrumbLink);
    //   // } else {
    //   //   totalLinkWidth += linkWidth;
    //   // }
    //   if(linkWidth < 43){
    //     linksToHide.push(breadcrumbLink);
    //   }
    // }
    // console.log('linksToHide', linksToHide);
    // linksToHide.forEach((link) => link.classList.add('hidden'));
  }
}

const BR: Breadcrumb[] = [
  {
    label: '1 first  ',
    url: '1',
    isHidden: false,
  },
  {
    label: '2 second ',
    url: '2',
    isHidden: false,
  },
  {
    label: '3 third ',
    url: '3',
    isHidden: false,
  },
  {
    label: '4 four ',
    url: '4',
    isHidden: false,
  },
];
