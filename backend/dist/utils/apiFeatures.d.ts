import { Query } from 'mongoose';
export declare class APIFeatures {
    query: Query<any[], any>;
    queryString: any;
    constructor(query: Query<any[], any>, queryString: any);
    filter(): this;
    sort(): this;
    limitFields(): this;
    paginate(): this;
}
//# sourceMappingURL=apiFeatures.d.ts.map