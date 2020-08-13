import { Injectable } from '@nestjs/common';
import { LoadAccountPort } from 'src/domains/ports/out/load-account.port';
import { UpdateAccountStatePort } from 'src/domains/ports/out/update-account-state.port';
import { AccountId, AccountEntity } from 'src/domains/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountOrmEntity } from './account.orm-entity';
import { Repository } from 'typeorm';
import { ActivityOrmEntity } from './activity.orm-entity';
import { AccountMapper } from './account.mapper';

@Injectable()
export class AccountPersistenceAdapter implements LoadAccountPort, UpdateAccountStatePort {

	constructor(
		@InjectRepository(AccountOrmEntity) private readonly _accountRepository: Repository<AccountOrmEntity>,
		@InjectRepository(ActivityOrmEntity) private readonly _activityOrmEntity: Repository<ActivityOrmEntity>
	) {}
	
	async loadAccount(accountId: AccountId): Promise<AccountEntity> {
		const account = await this._accountRepository.findOne({ userId: accountId });

		if (account === undefined) {
			throw new Error('Account not found');
		}

		const activities = await this._activityOrmEntity.find({ ownerAccountId: accountId });

		return AccountMapper.mapToDomain(account, activities);
	}

	updateActivities(account: AccountEntity) {
		account.activityWindow.activities.forEach(activity => {
			if (activity.id === null) {
				this._activityOrmEntity.save(AccountMapper.mapToActivityOrmEntity(activity));
			}
		})
	}

}