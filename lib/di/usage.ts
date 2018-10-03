import {Container, Injectable} from './di';

@Injectable
class UtilService {

}

@Injectable
class UserService {
    constructor(private utilService: UtilService) {
    }
}

const Config = Symbol('Config');

const container = new Container([
    {provide: Config, useValue: {a: 1}, multi: true},
    {provide: Config, useValue: {b: 2}, multi: true},
    {provide: UtilService, useClass: UtilService},
    {provide: UserService, useFactory: (utilService) => new UserService(utilService), deps: [UtilService]},
]);

const userService = container.resolve(UserService);
const config = container.resolve(Config);

''