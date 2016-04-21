import _ from 'lodash';
import normalizeIds from '../../utils/normalizeIds';
import QueryBuilderMethod from '../../queryBuilder/methods/QueryBuilderMethod';

export default class HasManyRelateMethod extends QueryBuilderMethod {

  constructor(builder, name, opt) {
    super(builder, name, opt);

    this.isWriteMethod = true;
    this.relation = opt.relation;
    this.owner = opt.owner;
    this.input = null;
    this.ids = null;
  }

  call(builder, args) {
    this.input = args[0];
    this.ids = normalizeIds(args[0], this.relation.relatedModelClass.getIdPropertyArray(), {arrayOutput: true});
    return true;
  }

  queryExecutor(builder) {
    var patch = {};

    _.each(this.relation.relatedProp, (relatedProp, idx) => {
      patch[relatedProp] = this.owner[this.relation.ownerProp[idx]];
    });

    return this.relation.relatedModelClass
      .query()
      .childQueryOf(builder)
      .patch(patch)
      .copyFrom(builder, /where/i)
      .whereInComposite(this.relation.relatedModelClass.getFullIdColumn(), this.ids)
      .call(this.relation.filter);
  }

  onAfterModelCreate() {
    return this.input;
  }
}
