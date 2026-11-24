declare module "page-flip" {
  export interface PageFlipEvent {
    data: unknown;
  }

  export class PageFlip {
    constructor(element: HTMLElement, settings: Record<string, unknown>);
    loadFromHTML(items: HTMLElement[] | NodeListOf<HTMLElement>): void;
    on(event: string, callback: (event: PageFlipEvent) => void): void;
    turnToPage(page: number): void;
    flipNext(corner?: "top" | "bottom"): void;
    flipPrev(corner?: "top" | "bottom"): void;
    getCurrentPageIndex(): number;
    destroy(): void;
  }
}
