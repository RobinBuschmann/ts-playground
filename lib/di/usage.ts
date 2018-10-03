import {Container, Inject, Injectable} from './di';

const Config = Symbol('Config');
const UtilConfig = Symbol('UtilConfig');

@Injectable
class UtilService {
    constructor(@Inject(UtilConfig) private config) {
    }

}

@Injectable
class UserService {
    constructor(private utilService: UtilService) {
    }
}


const container = new Container([
    {provide: UtilConfig, useValue: {usePromises: true}},
    {provide: Config, useValue: {a: 1}, multi: true},
    {provide: Config, useValue: {b: 2}, multi: true},
    {provide: UtilService, useClass: UtilService},
    {provide: UserService, useFactory: (utilService) => new UserService(utilService), deps: [UtilService]},
]);

const userService = container.resolve(UserService);
const config = container.resolve(Config);

''