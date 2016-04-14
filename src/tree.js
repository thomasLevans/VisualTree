import d3 from 'd3';

import DEF_CONFIG from './config.js';

/**
* Tree class encapsulating the state and behavior of
* a d3 tree visualization
*
* @class Tree
*/
export default class Tree {

  /**
  * Constructs a tree instance using default properties
  * or properties passed in a config object.
  *
  * @constructor
  * @param {Object} config - values for initial tree state
  */
  constructor(config = DEF_CONFIG) {
    this.data = config.data || DEF_CONFIG.data;
    this.elem = config.elem || DEF_CONFIG.elem;
    this.diameter = config.diameter || DEF_CONFIG.diameter;
    this.singleLayer = config.singleLayer || DEF_CONFIG.singleLayer;

    if(this.data.length) {
      this.data = new Map(this.data);
    }

    if (this.data.size !== 0) {
      this.data = this._translateAdjList(this.data);
    }

    this.visual = d3.layout.cluster()
      .size([360, this.diameter / 2 - 150])
      .sort(null);

    this.diagonal = d3.svg.diagonal.radial()
      .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

    this.svg = d3.select(this.elem)
      .append('svg')
        .attr('width', this.diameter)
        .attr('height', this.diameter)
      .append('g')
        .attr('transform', 'translate(' + this.diameter / 2 + ',' + this.diameter / 2 + ')');

  }

  /**
  * Updates the visual state
  *
  * @method
  */
  propagateUpdate() {

    if (this.singleLayer) {
      this.expand();
    }

    this.nodes = this.visual.nodes(this.data);
    this.links = this.visual.links(this.nodes);

    this.nodes = (this.singleLayer) ? this.nodes.filter((d) => { return !d.children; }) : this.nodes;

    this.link = this.svg.selectAll('.link')
        .data(this.links)
      .enter().append('path')
        .attr('class', 'edge')
        .attr('d', this.diagonal);

    this.node = this.svg.selectAll('.node')
        // .data(this.nodes.filter((d) => { return !d.children; }))
        .data(this.nodes)
      .enter().append('g')
        .attr('class', 'vertex')
        .attr('transform', function(d) {
          return 'rotate(' + (d.x - 90) + ')translate(' + d.y + ')';
        });

    this.node.append('circle')
      .attr('r', 4.5);

    this.node.append('text')
      .attr('dy', '.31em')
      .attr('text-anchor', function(d) { return d.x < 180 ? 'start' : 'end'; })
      .attr('transform', function(d) {
        return d.x < 180 ? 'translate(8)' : 'rotate(180)translate(-8)';
      })
      .text(function(d) { return d.name; });
  }

  /**
  * Merges the contents of args onto the tree as appropriate
  * If the tree is not empty the target subtree is inserted
  * overwriting the subtree where below the target
  *
  * @method merge
  * @param {Map} args - adjacency list in the form of a hashmap
  */
  merge(args) {
    let target = this._translateAdjList(args);

    let find = (node) => {
      if (node.name !== target.name) {
        node.children.forEach((child) => {
          find(child);
        });
      } else {
        node.children = target.children;
      }
    };

    if(this.data.size === 0) {
      this.data = target;
    }
    else {
      find(this.data);
    }

  }

  /**
  * Expands the tree by migrating all branches to leaves
  *
  * @method expand
  */
  expand() {

    let next = (node) => {

      if (node.children) {
        node.children.push({ name: node.name });

        node.children.forEach((c) => {
          next(c);
        });
      }

    };

    next(this.data);

  }

  /**
  * Translates an adjacency list into a di-graph
  *
  * @method
  * @param {Map} list - an adjacency list
  */
  _translateAdjList(list) {
    let graph = new Map();
    let subTrees = [];

    let getChildren = (args) => {
      if(args) {
        return args.map((c) => {
          let cur = list.get(c);
          list.delete(c);
          return {
            name: c,
            children: getChildren(cur)
          };
        });
      } else {
        return [];
      }
    };

    // derive all subtrees
    for (let [key, val] of list) {
      subTrees.push({
        name: key,
        children: getChildren(val)
      });
    }

    // if their are multiple subtrees return the prime subtree
    if (subTrees.length > 1) {
      graph = subTrees.filter((prev, elem) => {
        return (prev.children.indexOf(elem) !== -1) ? prev : elem;
      }).pop();
    } else {
      graph = subTrees.pop();
    }

    return graph;
  }

}
