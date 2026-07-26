import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello() {
    return {
      name: 'NexusEvent API',
      version: '1.0',
      description: 'API REST de gestion d\'événements',
      docs: '/api/docs',
      endpoints: {
        auth: {
          register: 'POST /auth/register',
          login: 'POST /auth/login',
          profile: 'GET /auth/profile',
        },
        users: 'CRUD /users (admin)',
        events: 'GET /events (public), POST/PUT/DELETE /events (auth)',
        bookings: 'CRUD /bookings (auth)',
        reviews: 'GET /reviews (public), POST/PUT/DELETE /reviews (auth)',
        dashboard: 'GET /dashboard/* (auth)',
        weather: 'GET /weather (public)',
      },
    };
  }
}
