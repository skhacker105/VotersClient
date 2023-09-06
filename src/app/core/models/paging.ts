export interface IGridConfig<T> {
    pageSize: number;
    pageNumber: number;
    sortColumn?: string;
    sortOrder?: number;
    data?: T;
    dataLength?: number;
}

export class GridConfig {
    static defaultPagingObject<T>(pageSize: number = 10): IGridConfig<T> {
        return {
            pageNumber: 0,
            pageSize: pageSize,
            dataLength: 0,
            sortColumn: '',
            sortOrder: 0,
            data: [] as T
          };
    }

    static getPagingQuery<T>(qry: IGridConfig<T>) {
        const newQry = JSON.parse(JSON.stringify(qry));
        newQry.data= [];
        return newQry;
    }

}
