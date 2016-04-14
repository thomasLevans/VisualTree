import {expect} from 'chai';
import d3 from 'd3';

import Tree from '../../src/tree';

describe('tree', () => {

  describe('can be instantiated', () => {
    // FIXME - unify this const and pull to top
    const EXPECTED = {
      name: 'x',
      children: [
        {
          name: 'y',
          children: [
            {
              name: 'w',
              children: []
            }
          ]
        },
        {
          name: 'z',
          children: []
        }
      ]
    };

    it('as an empty tree', () => {
      let t = new Tree();
      expect(t.data.size).to.equal(0);
    });

    it('with default config', () => {
      let t = new Tree();
      expect(t.data.size).to.equal(0);
      expect(t.elem).to.equal('body');
      expect(t.diameter).to.equal(750);
    });

    it('with custom config', () => {
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

    it('with an es6 map', () => {
      let config = {
        data: new Map([
          ['x', ['y','z']],
          ['y', ['w']]
        ])
      };

      let t = new Tree(config);
      expect(t.data).to.deep.match(EXPECTED);
    });

    it('with a multidimensional array', () => {
      let data = [
        ['x', ['y','z']],
        ['y', ['w']]
      ];

      let t = new Tree({ data: data });
      expect(t.data).to.deep.match(EXPECTED);
    });

  });

  describe('can merge data', () => {
    const EXPECTED = {
      name: 'parent',
      children: [
        {
          name: 'child1',
          children: []
        },
        {
          name: 'child2',
          children: [
            {
              name: 'grandchild1',
              children: []
            }
          ]
        }
      ]
    };

    it('into an empty tree', () => {
      let t = new Tree();
      let raw = new Map()
        .set('parent', ['child1','child2'])
        .set('child1', [])
        .set('child2', ['grandchild1'])
        .set('grandchild1', []);


      t.merge(raw);

      expect(t.data).to.deep.match(EXPECTED);
    });

    it('into a non-empty tree', () => {
      let partial = new Map()
        .set('parent', ['child1', 'child2']);
      let t = new Tree({ data: partial });

      partial = new Map()
        .set('child2', ['grandchild1']);

      t.merge(partial);

      expect(t.data).to.deep.match(EXPECTED);
    });

    afterEach(() => {
      d3.selectAll('svg')
        .remove();
    });

  });

  it('can expand by making all named nodes leaves', () => {
    let data = new Map([
      ['p1', ['c1','c2']],
      ['c2', ['r1']]
    ]);

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

  describe('can translate an adjacency list', () => {
    const EXPECTED = {
      'name':'r',
      'children': [
        {
          'name': 'p',
          'children': [
            {
              'name': 'z',
              'children': []
            }
          ]
        },
        {
          'name': 'q',
          'children': []
        }
      ]
    };

    it('that is ordered', () => {
      let tree = new Tree();
      let list = new Map()
        .set('r', ['p','q'])
        .set('p', ['z'])
        .set('q', [])
        .set('z', []);

      expect(tree._translateAdjList(list)).to.deep.match(EXPECTED);
    });

    it('that is unorderd', () => {
      let tree = new Tree();
      let list = new Map()
        .set('z', [])
        .set('q', [])
        .set('p', ['z'])
        .set('r', ['p', 'q']);

      expect(tree._translateAdjList(list)).to.deep.match(EXPECTED);
    });

    it('that implies leaves', () => {
      let tree = new Tree();

      let list = new Map()
        .set('p', ['z'])
        .set('r', ['p', 'q']);

      expect(tree._translateAdjList(list)).to.deep.match(EXPECTED);
    });

    afterEach(() => {
      d3.selectAll('svg')
        .remove();
    });

  });

  describe('can render', () => {
    let t;

    before(() => {
      let data = [
        ['q', ['r','u','z']],
        ['r', ['d','c']],
        ['u', ['i']]
      ];

      t = new Tree({ data: data });
      t.propagateUpdate();
    });


    it('a path for every edge', () => {
      let edgeCount = d3.selectAll('.edge')[0].length;
      expect(edgeCount).to.equal(6);
    });

    it('each vertex', () => {
      let vertexCount = d3.selectAll('.vertex')[0].length;
      expect(vertexCount).to.equal(7);
    });

    after(() => {
      d3.selectAll('svg')
        .remove();
    });

  });

});
