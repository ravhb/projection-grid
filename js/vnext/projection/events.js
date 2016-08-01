import _ from 'underscore';

function sequence(...args) {
  const callbacks = _.filter(args, _.isFunction);
  return function (...argsInner) {
    _.each(callbacks, cb => cb.apply(this, argsInner));
  };
}

export function events(state, eventsOptions) {
  const pairs = _.pairs(state.events).concat(_.pairs(eventsOptions));
  const events = _.reduce(pairs, (memo, [key, handler]) => {
    return _.extend(memo, {
      [key]: sequence(memo[key], handler)
    });
  }, {});

  return _.defaults({ events }, state);
}