import $ from 'jquery';
import _ from 'underscore';
import pGrid from 'component/grid';
import chai from 'chai';
import util from 'util';
import driver from 'driver';
import peopleData from 'data/people.json';

let expect = chai.expect;
let memoryDataSource = _.map(peopleData.value, (row) => {
  return _.pick(row, 'UserName', 'FirstName', 'LastName', 'Gender', 'Concurrency');
});
let memoryHeader = _.keys(_.first(memoryDataSource));
let memoryData = util.getExpectedGridData(memoryDataSource);
let gridConfig = {
  el: '#container',
  dataSource: {
    type: 'memory',
    data: memoryData,
  },
  columns: [
    {
      name: 'UserName',
    },
    {
      name: 'FirstName',
    },
    {
      name: 'LastName',
    },
    {
      name: 'Gender',
    },
  ],
};

let pgrid;
let pgridFactory;
let gridView;

describe('grid api check for non-vnext', function () {
  let bodyRowSelector = '#container .grid tbody .table__row--body';

  beforeEach(function () {
    util.renderTestContainer();
    pgridFactory = pGrid 
      .factory();
  });
  
  afterEach(() => {
    gridView.remove();
    util.cleanup();
  });

  it('verify selection function for non-vnext', function (done) {
    let selectionConfig = {
      selectable: true,
    };

    gridView = pgridFactory
      .create(_.extend(selectionConfig, gridConfig))
      .gridView
      .render({fetch: true});
    driver.element(bodyRowSelector)
      .then((result) => {
        return driver.click(util.getCheckboxElFromTbody(result, 0, 0));
      })
      .then(() => {
        let selectedItem = gridView.getSelection();
        expect(selectedItem.length).to.equal(1);
        expect(selectedItem[0]).to.equal(1);
      })
      .then(done)
      .catch(console.log);
  });
});
