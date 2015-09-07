export default function run(task) {
  const suspendedTasks = [];
  let completion;
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
};

function call(task, completion) {
  completion = completion || { value: undefined, exceptional: false, done: false};
  let result;
  try {
    if (completion.exceptional) {
      result = task.throw(completion.value);
    } else {
      result = task.next(completion.value);
    }
  } catch (e) {
    return {value: e, exceptional: true, done: true}
  }
  return {value: result.value, exceptional: false, done: result.done};
}