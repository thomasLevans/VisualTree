# VisualTree 0.0.5

[![Build Status](https://travis-ci.org/thomasLevans/VisualTree.svg?branch=master)](https://travis-ci.org/thomasLevans/VisualTree)

A tree structure visualization package using [D3.js](https://d3js.org/) for quick and easy use.

## Basic Usage
Instantiate a tree with default properties and some data.
```
var tree = new Tree({data: myData});

// no DOM element specified default appends to <body>
tree.init();

// renders the current visual state of the tree
tree.propagateUpdate();
```

__Note:__ See the config object section for details on what can be passed to the constructor and the default values.

## The Config Object
The default config looks like:
```
{
  data: new Map(),
  elem: 'body',
  diameter: 750,
  singleLayer: false
}
```
When passing a config to the constructor you can omit any of the properties in favor of the defaults.

### Config Properties
- data -> The root node of the tree, see __Data__ for expected structure.
- elem -> The DOM element to append the scalable vector graphic to.
- diameter -> The size of the circle the radial tree will occupy.
- singleLayer -> When true a leaf alias is created for every branch node and branch nodes will not be displayed.

__Note:__ If no data is passed in the config you can use `tree.push(myData)`

## Data
An adjacency list in the form of a multidimensional array. Leaves __do not__ need to be explicit.

### Leaves Implicit
```
[
  ['q', ['r','d','z']],
  ['r', ['a','b']],
  ['a', ['1']],
  ['z', ['g','u']]
]
```
### Leaves Explicit
```
[
  ['q', ['r','d','z']],
  ['r', ['a','b']],
  ['d', []],
  ['a', ['1']],
  ['z', ['g','u']],
  ['b', []],
  ['1', []],
  ['g', []],
  ['u', []]
]
```
