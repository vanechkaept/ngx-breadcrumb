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

  elementInMenu: HTMLElement[] = [];

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
      map((width: number) => this._checkFitting(width, BR)),
      distinctUntilChanged()
    );
  }

  private _checkFitting(width: number, breadcrumb: Breadcrumb[]) {
    console.log(width);
    const breadcrumbLinks: HTMLElement[] = Array.from(
      this.breadcrumbContainer?.nativeElement.querySelectorAll('a') || []
    );
    // console.log('breadcrumbLinks', breadcrumbLinks);

    const currentLink: HTMLElement = breadcrumbLinks.splice(-1)[0];
    const homeLink: HTMLElement = breadcrumbLinks.splice(0, 1)[0];
    // console.log('currentLink', currentLink);
    // console.log('homeLink', homeLink);
    // console.log('breadcrumbLinks 2', breadcrumbLinks);
    // parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    let allWidth: number =
      this._getWidthOfElement(currentLink) + this._getWidthOfElement(homeLink);

    // for (let link of this._notFit) {
    // this.breadcrumbContainer?.nativeElement.appendChild(link);
    // }

    // this._notFit = [];
    for (let link of breadcrumbLinks) {
      allWidth += this._getWidthOfElement(link);
      if (allWidth > width) {
        this.elementInMenu.push(link);
        // link.remove();
      }
    }

    console.log(this.elementInMenu);

    return BR;
  }

  private _getWidthOfElement(el: HTMLElement): number {
    if (!el) return 0;
    return el.offsetWidth;
    // const style = el?.currentStyle || window.getComputedStyle(el),
    //   width = el.offsetWidth, // or use style.width
    //   margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
    //   padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
    //   border =
    //     parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth);

    // return width + margin - padding + border;
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
  {
    label: '5 five ',
    url: '5',
    isHidden: false,
  },
];
