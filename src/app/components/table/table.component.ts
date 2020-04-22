import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {

  numElements = new Array(4);
  sizeWindow: number;
  private gamma = 0.7;
  private alpha = 0.9;
  private wallConfig = {
    4: ['bottom'],
    5: ['top', 'right'],
    9: ['bottom', 'right'],
    11: ['left', 'top'],
  };

  routesGreen = [];

  ngOnInit(): void {
    this.handlerSize(window.innerHeight, window.innerWidth);
  }

  private handlerSize(height, width): void {
    this.sizeWindow = (height < width ? height : width) * 0.2;
  }

  private createEmptyArray(size: number): number[][] {
    const response = [];
    for (let i = 0; i < size; i++) {
      response.push(new Array(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
    }
    return response;
  }

  private getMaxIndex(a: number[]): number {
    let max = a[0];
    let maxIndex = 0;
    for (let i = 1; i < a.length; i++) {
        if (a[i] > max) {
            maxIndex = i;
            max = a[i];
        }
    }
    return maxIndex;
  }

  handlerWallsInMap(position: number): string[] {
    return this.wallConfig[position];
  }

  getBestRoute(init: number, end: number) {
    init = +init;
    end = +end;
    this.routesGreen = [];
    this.routesGreen.push(init);
    const routes = [init];
    const R = [
    // 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 10 11 12 13 14 15
      [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
      [0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0], // 3
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 4
      [0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0], // 5
      [0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0], // 6
      [0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 7
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0], // 8
      [0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0], // 9
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0], // 10
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1], // 11
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0], // 12
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0], // 13
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1], // 14
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 1], // 15
    ];
    R[end][end] = 1000;
    const RMap = this.createEmptyArray(16);

    for (let index = 0; index < 1000; index++) {
      const startPosition = Math.floor(Math.random() * 16);
      const actions = [];
      for (let idxR = 0; idxR < R[startPosition].length; idxR++) {
        if (R[startPosition][idxR] > 0) {
          actions.push(idxR);
        }
      }
      const nextPosition: any = Math.floor(Math.random() * actions.length);
      const position = actions[nextPosition];
      if (typeof RMap[startPosition][position] !== 'number') { RMap[startPosition][position] = 0; }
      let maxValue = 0;
      if (typeof Math.max(...RMap[position]) !== 'number') {
        maxValue = 0;
      } else {
        maxValue = Math.max(...RMap[position]);
      }
      const TD = R[startPosition][position] + this.gamma * maxValue - RMap[startPosition][position];
      RMap[startPosition][position] = RMap[startPosition][position] + TD * this.alpha;
    }
    while (init !== end) {
      init = this.getMaxIndex(RMap[init]);
      routes.push(init);
    }
    this.addColor(routes);
  }

  addColor(n: number[]) {
    if (n.length > 0) {
      setTimeout(() => {
        this.routesGreen.push(n[0]);
        this.addColor(n.slice(1));
      }, 100);
    }
  }

}
