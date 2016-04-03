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

    this.visual = d3.layout.cluster()
      .size([360, this.diameter / 2 - 150])
      .sort(null);
      // .separation(function(a, b) {
      //   return (a.parent == b.parent ? 1 : 2) / a.depth;
      // });

    this.diagonal = d3.svg.diagonal.radial()
      .projection(function(d) { return [d.y, d.x / 180 * Math.PI]; });

  }

  /**
  * Initializes the SVG
  *
  * @method
  */
  init() {
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

    console.log(this.nodes);

    this.link = this.svg.selectAll('.link')
        .data(this.links)
      .enter().append('path')
        .attr('class', 'link')
        .attr('d', this.diagonal);

    this.node = this.svg.selectAll('.node')
        // .data(this.nodes.filter((d) => { return !d.children; }))
        .data(this.nodes)
      .enter().append('g')
        .attr('class', 'node')
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
  * Takes a map if objects and their children and either
  * assigns the map as this tree's data if none or performs
  * a merges the two maps as args U (args n tree.data)
  *
  * @method push
  * @param {Map} args - nested map of node names and children
  */
  push(args) {
    if(this.data.size === 0) {
      this.data = args;
    }
    else {
      // TODO : LOJ
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

}
