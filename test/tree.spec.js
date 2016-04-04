import {expect} from 'chai';

import Tree from '../src/tree';

describe('tree', () => {

  it('instantiates an empty tree', () => {
    let t = new Tree();
    expect(t.data.size).to.equal(0);
  });

  it('can push data onto the tree', () => {
    let t = new Tree();
    let raw = {
      name: 'parent',
      childern: [
        {
          name: 'child1'
        },
        {
          name: 'child2',
          children: [
            {
              name: 'grandchild1'
            }
          ]
        }
      ]
    };

    t.push(raw);

    expect(t.data).to.equal(raw);
  });

  it('can be passed a config object', () => {
    let config = {
      elem: 'vis',
      data: new Map(),
      diameter: 660
    };

    let t = new Tree(config);

    expect(t.elem).to.equal('vis');
    expect(t.data.size).to.equal(0);
    expect(t.diameter).to.equal(660);
  });

  it('has default props when not init with config object', () => {
    let t = new Tree();
    expect(t.data.size).to.equal(0);
    expect(t.elem).to.equal('body');
    expect(t.diameter).to.equal(750);
  });

  it('can expand by making all named nodes leaves', () => {
    let data = {
      'name': 'p1',
      'children': [
        {
          'name':'c1'
        },
        {
          'name':'c2',
          'children': [
            {
              'name':'r1'
            }
          ]
        }
      ]
    };

    let tree = new Tree({data: data});

    tree.expand();

    expect(tree.data).to.deep.match({
      'name': 'p1',
      'children': [
        {
          'name':'c1'
        },
        {
          'name':'c2',
          'children': [
            {
              'name':'r1'
            },
            {
              'name':'c2'
            }
          ]
        },
        {
          'name': 'p1'
        }
      ]
    });
  });

  it('can merge updated data into an existing tree', () => {
    let initialData = {
      'name': 'p',
      'children': [
        {
          'name': 'b'
        },
        {
          'name': 'c'
        }
      ]
    };

    let tree = new Tree({data: initialData});
    expect(tree.data).to.deep.match(initialData);

    let updatedData = {
      'name': 'p',
      'children': [
        {
          'name': 'b',
          'children': [
            {
              'name': 'e'
            }
          ]
        },
        {
          'name': 'c',
          'children': [
            {
              'name': 'f'
            }
          ]
        }
      ]
    };

    let final = tree.merge(updatedData);

    expect(tree.data).to.deep.match(updatedData);
  });

});
