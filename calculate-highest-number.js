// each "gene" is coded by a letter of the alphabet
// each gene is basically a function that takes one input
// and returns an output
//
// in this example we take a number as an input and perform
// an expression on it, such as add one, minus one, sqrt, divide by 2
// the "z" gene is a pass thru gene that does nothing.
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

// an array of all the different possible codes
// probably could derive this from the genes array
var alphabet = ['a', 'b', 'c', 'd', 'z'];


// Class Algo
// represents an algorithm
// constructed with a DNA string to represent the algorithm it performs
// initialize the result and fitness
function Algo(dna) {
  this.dna = dna;
  this.result = 0;
  this.fitness = null;
}
// get the DNA string
Algo.prototype.getDna = function() {
  return this.dna;
};
// execute the algorithm and set the "result" member variable to the
// final output
Algo.prototype.execute = function() {
  // loop through each char in the dna string
  for (var i = this.dna.length - 1; i >= 0; i--) {
    // set the result to the return value of this genes function
    this.result = genes[this.dna[i]](this.result);
  }
};
// get the result
Algo.prototype.getResult = function() {
  return this.result;
};
// reset the algorithm to be run again
Algo.prototype.reset = function() {
  this.result = 0;
  this.fitness = null;
};
// produce an offspring algorithm by
// taking another algorithm as a param
// creating a new DNA string using both the parents
// DNA strings as a source and choosing the corresponding gene
// on a 50-50 basis
Algo.prototype.mate = function(otherAlgo) {
  var offspringDna = '';
  for (var i = this.getDna().length - 1; i >= 0; i--) {
    offspringDna += (Math.random() > 0.5) ? this.getDna()[i] : otherAlgo.getDna()[i];
  }
  return new Algo(offspringDna);
};

// generate a number of random algorithms of a specific size
function generateAlgos(numAlgos, genomeSize) {
  var algos = [],
    randomDna;
  for (var i = 0; i < numAlgos; i++) {
    randomDna = '';

    for (var j = genomeSize - 1; j >= 0; j--) {
      // add a random gene to the DNA string
      randomDna += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    algos.push(new Algo(randomDna));
  };

  return algos;
}

// reset and execute all the algos in the passed in array
function executeAlgos(algos) {
  for (var i = algos.length - 1; i >= 0; i--) {
    algos[i].reset();
    algos[i].execute();
  }
}

// the calculateFitness function is to determine the fittest
// algos, it takes an array of executed algos and sorts them
// in order of fitness, fittest first.
// this specific goal is to score the highest result
function calculateFitness(algos) {
  algos.sort(function(a, b) {
    return a.getResult() > b.getResult();
  });
  for (var i = 0; i < algos.length; i++) {
    algos[i].fitness = i;
  }
}

// display the results of each algo
function display(algos) {
  calculateFitness(algos);
  for (var i = algos.length - 1; i >= 0; i--) {
    console.log('Algo with DNA: ' + algos[i].getDna() + ' got result: ' + algos[i].getResult() + ' and achieved fitness of ' + algos[i].fitness);
  }
}

// assume fittest are first
// half the algos die
// remove the last half of the array and return the result
function naturalSelection(algos) {
  return algos.splice(0, Math.ceil(algos.length / 2));
}

// double the number of algos by mating
// fittest with each of the remaining
function reproduce(algos) {
  var offspring = [],
    mate;
  // loop through all the algos starting with the last one,
  // mate it with the algo before it in the array
  // mate the first algo with the last algo
  for (var i = algos.length - 1; i >= 0; i--) {
    mate = i == 0 ? algos[algos.length - 1] : algos[i - 1];
    offspring.push(algos[i].mate(mate));
  }
  return algos.concat(offspring);
}

// generate some algos
// execute the algos 100 times,
// evolving after each generation
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
