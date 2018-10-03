type Getterify<T extends any[]> = { [P in keyof T]: () => T[P] };

const createValidator = <AT extends any[], MT>(errorName: string, validationFn: (target, ...args: AT) => any, meta?: MT) =>
    Object.assign(
        (...args: Getterify<AT>) => (control) => (
            {[errorName]: !validationFn(control.value, ...(args.map(a => a()) as any))}
        ),
        {errorName, meta},
    );

const isNiceValidator = createValidator('isNotNice', (val: string, isit: boolean) => isit, {translation: 'test'});
const isAfterDateValidator = createValidator('isNotAfterDate', (date: Date, date2: Date) => date.getTime() > date2.getTime());


console.log(isNiceValidator(() => true)({value: 1}));
console.log(isAfterDateValidator(() => new Date(2000, 1, 1))({value: new Date(2050, 1, 1)}));
