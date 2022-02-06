import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    const response = await this.repository.findOne(user_id, { relations: ['games'] });

    if (!response) {
      throw new Error("Invalid user_id to find user.");
    }

    return response;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return this.repository.query(`
      SELECT
        *
      FROM
        users
      ORDER BY
        first_name
    `);
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return this.repository.query(`
      SELECT 
        *
      FROM
        users
      WHERE
        lower(first_name) = $1
        and lower(last_name) = $2
    `, [first_name.toLowerCase(), last_name.toLowerCase()]);
  }
}
