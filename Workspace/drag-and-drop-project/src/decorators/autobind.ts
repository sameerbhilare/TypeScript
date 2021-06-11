// Autobind decorator - A method decorator
// decorator, which we can add, which automatically binds to 'this' key word
// so that we don't have to call bind() in the addEventListener
// The first and second parameters are not used so TS gives compiation error.
// Hence using underscore as a special syntax which TS understands and hence does not complain
export function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value; // store the method which we originally defined.
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjustedDescriptor;
}
