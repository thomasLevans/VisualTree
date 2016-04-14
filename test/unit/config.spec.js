import {expect} from 'chai';

import DEF_CONFIG from '../../src/config';

describe('default config', () => {

  it('has property `data` with type map', () => {
    expect(DEF_CONFIG).to.have.property('data');
    expect(DEF_CONFIG.data).to.be.a('map');
  });

  it('has property `elem` with type string', () => {
    expect(DEF_CONFIG).to.have.property('elem');
    expect(DEF_CONFIG.elem).to.be.a('string');
  });

  it('has property `diameter` with value 750', () => {
    expect(DEF_CONFIG).to.have.property('diameter');
    expect(DEF_CONFIG.diameter).to.equal(750);
  });

  it('has property `singleLayer` with value false', () => {
    expect(DEF_CONFIG).to.have.property('singleLayer');
    expect(DEF_CONFIG.singleLayer).to.equal(false);
  });

});
