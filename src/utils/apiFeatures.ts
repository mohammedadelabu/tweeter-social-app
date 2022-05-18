class APIFeatures {
  query: any;
  queryString: any;
  constructor(query: any, queryString: any) {
    this.query = query;
    this.queryString = queryString;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit); //skip is the amount of result that should be skipped before queryiing that, while limit is the amount of result that we want in the query

    return this;
  }
  sort() {
    if (this.queryString.sort) {
      const sortSearch = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortSearch);
    }
    return this;
  }
}

export default APIFeatures;
