import run from '../src/task-runner';

const assert = require("assert");

describe('run', () => {
  it('should return the result of the task', () => {
    assert.equal(run(function *() {
      return 42;
    }()), 42);
  });

  it('should throw if the task throws', () => {
    assert.throws(() => run(function *() {
      throw Error('error');
    }()), /error/);
  });

  it('should call subtasks', () => {
    assert.equal(run(task1()), 3);

    function *task1() {
      return (yield task2()) + (yield task3());
    }
    function *task2() {
      return 1;
    }
    function *task3() {
      return 2;
    }
  });

  it('should propagate exceptions from subtasks', () => {
    assert.equal(run(task1()), 1);

    function *task1() {
      let x;
      try {
        x = yield task2(); 
      } catch (e) {
        x = e;
      }
      return x;
    }

    function *task2() {
      throw 1;
      return 2;
    }
  });
});