// import supertest from 'supertest';
// import mongoose from 'mongoose';
// import { MongoDB } from '../services/mongoDB';
// import { UserObject } from '../models/users/users.interface';
// import { PersistenciaMongo } from '../models/users/DAOs/mongoDAO';
// import { authAPI } from '../apis/authAPI';
// import ExpressServer from '../services/server';
// import { expect } from 'chai';
// import { Logger } from '../utils/logger';

// describe('Tests de los endpoints de usuarios.', () => {
//   let newMongo: any;
//   let request: any;
//   let persistencia: any;

//   beforeAll(() => {
//     jest.spyOn(mongoose, 'createConnection').mockImplementationOnce(() => 'Connected');
//     newMongo = new MongoDB();
//     request = supertest(ExpressServer);
//     persistencia = authAPI.userModel;
//   });

//   afterAll((done) => {
//     mongoose.disconnect();
//     done();
//   });

//   test('Debería devolver conexión a mongo falsa', async () => {
//     const connection = newMongo.getConnection();
//     expect(connection).to.equal('Connected');
//   });

//   test('Deberia dar error si el usuario es incorrecto.', async () => {
//     const mockData = {
//       msg: 'Fallo el proceso de login.'
//     };
//     jest.spyOn(persistencia, 'find').mockImplementationOnce(() => Promise.resolve(mockData) as any);
//     const body = {
//       username: 'HomeroElGrande',
//       password: 'ElBarto'
//     };
//     const expectedResponse = mockData;
//     const response = await request.post('/api/user/login').send(body);
//     expect(response.body).to.deep.equal(expectedResponse);
//   });

//   //   test('Deberia conectar si el usuario es correcto.', async () => {
//   //     const mockData: UserObject[] = [
//   //       {
//   //         _id: '61acdefe30720c9669228021',
//   //         username: 'HomeroElGrande',
//   //         email: 'homero@springfield.com',
//   //         password: '$2b$10$/G3EEIak14MWiXiIG1Srm.C.kyW8jlGM5/xOHAbcl6vN5rNDWtSK2',
//   //         firstName: 'Homero',
//   //         lastName: 'Simpson',
//   //         address: 'Av. Siempre Viva 456',
//   //         phone: '555-555-5555',
//   //         age: 39,
//   //         isAdmin: false,
//   //         timestamp: '2021-12-05 12:47:10'
//   //       }
//   //     ];
//   //     jest.spyOn(persistencia, 'find').mockImplementationOnce(() => Promise.resolve(mockData) as any);
//   //     const body = {
//   //       username: 'HomeroElGrande',
//   //       password: 'HomeroRules2021'
//   //     };
//   //     const expectedResponse = {
//   //       data: mockData
//   //     };
//   //     const response = await request.post('/api/user/login').send(body);
//   //     expect(response.body).to.deep.equal(expectedResponse);
//   //   });
// });
