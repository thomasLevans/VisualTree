import d3 from 'd3';
import Tree from './tree';

d3.json('../dat/adj_list.json', (err, data) => {
  if (err) {
    return console.error(err);
  }

  let config = {
    adjList: data
  };

  let tree = new Tree(config);

  tree.propagateUpdate();
});
