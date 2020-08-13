import { Module } from '@nestjs/common';
import { AccountPersistenceAdapter } from './account-persistence.adapter';

@Module({
	providers: [
		AccountPersistenceAdapter
	],
	exports: [
		AccountPersistenceAdapter
	]
})
export class AccountPersistenceModule {}