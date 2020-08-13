import { Module, Global } from '@nestjs/common';
import { AccountPersistenceAdapter } from './account-persistence.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountOrmEntity } from './account.orm-entity';
import { ActivityOrmEntity } from './activity.orm-entity';
import { SendMoneyUseCaseSymbol } from 'src/domains/ports/in/send-money.use-case';
import { SendMoneyService } from 'src/domains/services/send-money.service';

@Global()
@Module({
	imports: [
		TypeOrmModule.forFeature([AccountOrmEntity, ActivityOrmEntity])
	],
	providers: [
		AccountPersistenceAdapter,
		{
			provide: SendMoneyUseCaseSymbol,
			useFactory: (adapter) => {
				return new SendMoneyService(adapter, adapter)
			},
			inject: [AccountPersistenceAdapter]
		}
	],
	exports: [
		SendMoneyUseCaseSymbol
	]
})
export class AccountPersistenceModule {}