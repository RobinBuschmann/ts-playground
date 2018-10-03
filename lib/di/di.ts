import 'reflect-metadata';

interface Provider {
    getDependentTokens();
    getValue(dependencies);
}

export const Injectable = t => null;
// TODO Implement possibility to inject via tokens
export const Inject = token => target => null;

export class ClassProvider implements Provider {
    constructor(private options) {
    }
    getDependentTokens() {
        return Reflect.getMetadata('design:paramtypes', this.options.useClass) || [];
    }
    getValue(dependencies: any[]) {
        return new this.options.useClass(...dependencies);
    }
}

export class ValueProvider implements Provider {
    constructor(private options) {
    }
    getDependentTokens() {
        return [];
    }
    getValue(dependencies: any[]) {
        return this.options.useValue;
    }
}

export class FactoryProvider implements Provider {
    constructor(private options) {
    }
    getDependentTokens() {
        return this.options.deps || [];
    }
    getValue(dependencies: any[]) {
        return this.options.useFactory(...dependencies);
    }
}

const mapToProvider = {
    useClass: ClassProvider,
    useValue: ValueProvider,
    useFactory: FactoryProvider,
};

const toArray = value => Array.isArray(value) ? value : [value];

export class Container {
    private cache = new Map();
    private providers = new Map();

    constructor(providerOptions) {
        this.resolveProviders(providerOptions);
    }

    resolve(token) {
        if (this.cache.has(token)) {
            return this.cache.get(token);
        }
        if (!this.providers.has(token)) {
            throw '';
        }
        const options = this.providers.get(token);
        const providers = toArray(options.provider);
        const values = providers.map(provider =>
            provider.getValue(provider.getDependentTokens().map(token => this.resolve(token))));
        this.cache.set(token, values);

        return options.multi
            ? values
            : values[0];
    }

    private resolveProviders(providerOptions) {
        const getUseKey = options =>
            Object.keys(options).reduce((useKey, key) => key.startsWith('use') ? key : useKey);

        providerOptions.forEach((options) => {
            const token = options.provide;
            const provider = new mapToProvider[getUseKey(options)](options);
            this.providers.set(
                token,
                {
                    ...options,
                    provider: options.multi
                        ? [...((this.providers.get(token) || {}).provider || []), provider]
                        : provider,
                },
            );
        });
    }
}
