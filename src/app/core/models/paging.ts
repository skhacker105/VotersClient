export interface IGridConfig<T> {
    pageSize: number;
    pageNumber: number;
    sortColumn: string;
    sortOrder: string;
    data: T;
    dataLength: number;
}

export class GridConfig<T> implements IGridConfig<T> {
    pageSize: number;
    pageNumber: number;
    sortColumn: string;
    sortOrder: string;
    data: T;
    dataLength: number;
    isExpanded = true;

    constructor(pageSize: number = 5) {
        this.pageNumber = 0;
        this.pageSize = pageSize;
        this.dataLength = 0;
        this.sortColumn = 'createdOn';
        this.sortOrder = 'desc';
        this.data = [] as T;
    }

    getCurrentPageQuery<T>(qry: IGridConfig<T>): IGridConfig<T> {
        const newQry = JSON.parse(JSON.stringify(qry));
        newQry.data = [];
        return newQry;
    }

    getNextPageQuery<T>(qry: IGridConfig<T>): IGridConfig<T> | undefined {
        if (!this.hasNextPage()) return undefined;

        const newQry = new GridConfig<T>(qry.pageSize);
        newQry.data = [] as T;
        newQry.pageNumber = newQry.pageNumber + 1;
        return newQry;
    }

    setData(gridConfig: IGridConfig<T>): void {
        this.pageNumber = gridConfig.pageNumber;
        this.pageSize = gridConfig.pageSize;
        this.dataLength = gridConfig.dataLength;
        this.sortColumn = gridConfig.sortColumn;
        this.sortOrder = gridConfig.sortOrder;
        this.data = gridConfig.data;
    }

    hasNextPage(): boolean {
        return this.dataLength > (this.pageSize * this.pageNumber) + this.pageSize
    }

}
