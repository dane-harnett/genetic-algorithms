var genes = {
  a: function(input) {
    return input + 1;
  },
  b: function(input) {
    return input - 1;
  },
  c: function(input) {
    return input * input;
  },
  d: function(input) {
    return input / 2;
  },
  // do nothing gene
  z: function(input) {
    return input;
  }
};

var alphabet = ['a', 'b', 'c', 'd', 'z'];

function Algo(dna) {
  this.dna = dna;
  this.result = 0;
  this.fitness = null;
}
Algo.prototype.getDna = function() {
  return this.dna;
};
Algo.prototype.execute = function() {
  for (var i = this.dna.length - 1; i >= 0; i--) {
    this.result = genes[this.dna[i]](this.result);
  }
};
Algo.prototype.getResult = function() {
  return this.result;
};
Algo.prototype.reset = function() {
  this.result = 0;
  this.fitness = null;
};
Algo.prototype.mate = function(otherAlgo) {
  var offspringDna = '';
  for (var i = this.getDna().length - 1; i >= 0; i--) {
    offspringDna += (Math.random() > 0.5) ? this.getDna()[i] : otherAlgo.getDna()[i];
  }
  return new Algo(offspringDna);
};


function generateAlgos(numAlgos, genomeSize) {
  var algos = [];
  var randomDna;
  for (var i = 0; i < numAlgos; i++) {
    randomDna = '';

    for (var j = genomeSize - 1; j >= 0; j--) {
      randomDna += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    algos.push(new Algo(randomDna));
  };

  return algos;
}

function executeAlgos(algos) {
  for (var i = algos.length - 1; i >= 0; i--) {
    algos[i].reset();
    algos[i].execute();
  }
}

// the goal is to score the highest result
function calculateFitness(algos) {
  algos.sort(function(a, b) {
    return a.getResult() > b.getResult();
  });
  for (var i = 0; i < algos.length; i++) {
    algos[i].fitness = i;
  }
}

function display(algos) {
  calculateFitness(algos);
  for (var i = algos.length - 1; i >= 0; i--) {
    console.log('Algo with DNA: ' + algos[i].getDna() + ' got result: ' + algos[i].getResult() + ' and achieved fitness of ' + algos[i].fitness);
  }
}

// assume fittest are first
// half the algos die
function naturalSelection(algos) {
  return algos.splice(0, Math.ceil(algos.length / 2));
}

// double the number of algos by mating
// fittest with each of the remaining
function reproduce(algos) {
  var offspring = [];
  var mate;
  for (var i = algos.length - 1; i >= 0; i--) {
    mate = i == 0 ? algos[algos.length - 1] : algos[i - 1];
    offspring.push(algos[i].mate(mate));
  }
  return algos.concat(offspring);
}

function main() {
  var algos = generateAlgos(10, 6);

  for (var i = 0; i < 100; i++) {
    console.log('---- GENERATION ' + i + ' ----');
    executeAlgos(algos);
    display(algos);
    naturalSelection(algos);
    algos = reproduce(algos);
  }
}
