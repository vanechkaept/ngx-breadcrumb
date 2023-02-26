import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  QueryList,
  TemplateRef,
  ViewChildren,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subscription, fromEvent, BehaviorSubject, Observable } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap,
} from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
  isHidden?: boolean;
  el?: ElementRef;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class BreadcrumbComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() breadcrumbLinks = BR;

  @ViewChild('breadcrumbContainer', { static: false })
  breadcrumbContainer: ElementRef;

  @ViewChildren('breadcrumbs')
  breadcrumbsEl!: QueryList<ElementRef>;

  elementInMenu: HTMLElement[] = [];

  breadcrumbsList$ = new Observable<Breadcrumb[]>();

  private resizeSubscription: Subscription;

  private _width$ = new BehaviorSubject<number>(0);
  private _observer: ResizeObserver = new ResizeObserver((entries) => {
    this._width$.next(entries[0].contentRect.width);
  });

  constructor(private _cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.breadcrumbsList$ = this._width$.pipe(
      debounceTime(100),
      startWith(1000),
      map((width: number) => this._checkFitting(width, BR)),
      // distinctUntilChanged(),
      tap((_) => {
        setTimeout(() => this._cd.detectChanges());
      })
    );
  }

  private _checkFitting(width: number, breadcrumb: Breadcrumb[]) {
    console.log(width);
    console.log(this.breadcrumbsEl?.toArray());
    const breadcrumbLinks: ElementRef[] = this.breadcrumbsEl?.toArray() || [];
    console.log('breadcrumbLinks', breadcrumbLinks);
    // if (breadcrumb.length !== breadcrumbLinks.length) {
    //   return breadcrumb;
    // }

    breadcrumb.forEach((b, i) => {
      b.el = breadcrumbLinks[i];
    });
    console.log('breadcrumb', breadcrumb);

    const currentLink: Breadcrumb = breadcrumb.concat().splice(-1)[0];
    const homeLink: Breadcrumb = breadcrumb.concat().splice(0, 1)[0];
    let allWidth: number =
      this._getWidthOfElement(currentLink?.el?.nativeElement) +
      this._getWidthOfElement(homeLink?.el?.nativeElement);

    for (let br of breadcrumb) {
      allWidth += this._getWidthOfElement(br?.el?.nativeElement);
      br.isHidden = allWidth > width;
    }

    // breadcrumb.push(currentLink);
    // breadcrumb.unshift(homeLink);

    console.log(
      'result',
      breadcrumb.map((c) => c.isHidden)
    );

    return breadcrumb;
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
    isHidden: true,
  },
  {
    label: '5 five ',
    url: '5',
    isHidden: false,
  },
];
