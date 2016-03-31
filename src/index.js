import d3 from 'd3';
import Tree from './tree';

d3.json('../dat/dat.json', (err, data) => {
  if (err) {
    return console.error(err)
  }

  let tree = new Tree({data: data});

  tree.init();

  tree.propagateUpdate();
});
