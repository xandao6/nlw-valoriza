import { getCustomRepository } from 'typeorm';
import { hash } from 'bcryptjs';
import UserRepository from '../repositories/UserRepository';

interface INewUserRequest {
	name: string;
	email: string;
	password: string;
}

export default class CreateUserService {
	async execute({ name, email, password }: INewUserRequest) {
		const userRepository = getCustomRepository(UserRepository);

		if (!email) {
			throw new Error('Invalid email');
		}

		const userAlreadyExists = await userRepository.findOne({ email });

		if (userAlreadyExists) {
			throw new Error('User already exists');
		}

		if (!password) {
			throw new Error('Invalid password');
		}

		const user = userRepository.create({
			name,
			email,
			admin: false,
			password: await hash(password, 8),
		});

		await userRepository.save(user);

		return user;
	}
}
