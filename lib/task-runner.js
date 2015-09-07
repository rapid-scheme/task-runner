"use strict";
function run() {
  var suspendedTasks = [];
  var completion;
  while (true) {
    while (!(completion = call(task)).done) {
      suspendedTasks.push(task);
      task = completion.value;
    }
    while (completion.done && suspendedTasks.length) {
      task = suspendedTasks.pop();
      completion = call(task, completion);
    }
    if (completion.done) {
      if (completion.exceptional) {
        throw completion.value;
      }
      return completion.value;
    }
    suspendedTasks.push(task);
    task = completion.value;
  }
}
var $__default = run;
;
function call(task, completion) {
  completion = completion || {
    value: undefined,
    exceptional: false,
    done: false
  };
  try {
    if (completion.exceptional) {
      result = task.throw(completion.value);
    } else {
      result = task.next(completion.value);
    }
  } catch (e) {
    return {
      value: e,
      exceptional: true,
      done: true
    };
  }
  return {
    value: result.value,
    exceptional: false,
    done: result.done
  };
}
Object.defineProperties(module.exports, {
  default: {get: function() {
      return $__default;
    }},
  __esModule: {value: true}
});
