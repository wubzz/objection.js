import _ from 'lodash';
import UpdateMethod from '../../queryBuilder/methods/UpdateMethod';

export default class ManyToManyUpdateSqliteMethod extends UpdateMethod {

  constructor(builder, name, opt) {
    super(builder, name, opt);

    this.relation = opt.relation;
    this.owner = opt.owner;
  }

  onBeforeBuild(builder) {
    super.onBeforeBuild(builder);
    this.relation.selectForModifySqlite(builder, this.owner).call(this.relation.filter);
  }
}
