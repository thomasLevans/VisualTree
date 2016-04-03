import d3 from 'd3';
import Tree from './tree';

d3.json('../dat/dat.json', (err, data) => {
  if (err) {
    return console.error(err);
  }

  let config = {
    data: data,
    singleLayer: true
  };

  let tree = new Tree(config);

  tree.init();

  tree.propagateUpdate();
});
