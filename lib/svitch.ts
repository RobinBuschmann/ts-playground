const next = Symbol('next');
const n = next;
type SvitchCases<F extends Function, K extends string> = { [key in K]: F | symbol } & { default: F }

const sw = <F extends Function, K extends string>(cases: SvitchCases<F, K>) => {
    const _cases = Object
        .entries(cases)
        .reverse()
        .reduce((meta: any, [key, value]) => {
            meta.nextValue = value !== next ? value : meta.nextValue;
            meta.acc[key] = meta.nextValue;
            return meta;
        }, {acc: Object.create(cases), nextValue: cases['default']}).acc;
    return (value: string | number | symbol) => _cases[value in cases ? value : 'default']();
};


// Usage
// ---------------
const SpecialGuestToken = Symbol('SpecialGuest');
const determineUserFunction = sw({
    heidi: n,
    ['bär']: () => 'bär',
    roland: n,
    elisa: n,
    robin: () => 'baum',
    [SpecialGuestToken]: () => 'special guest',
    default: () => 'who?',
});

console.log(determineUserFunction('elisa'));
console.log(determineUserFunction('heidi'));
console.log(determineUserFunction('roland'));
console.log(determineUserFunction('robin'));
console.log(determineUserFunction(SpecialGuestToken));
console.log(determineUserFunction('bla'));