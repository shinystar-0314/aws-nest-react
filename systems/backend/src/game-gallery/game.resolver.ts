import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

import { AddGameToLibraryArgs } from './dto/add-game-to-library.args';
import { GetGameArgs } from './dto/get-game.args';
import { GetGameListArgs } from './dto/get-game-list.args';
import { GameService } from './game.service';
import { Game, GameList } from './models/game.model';
import { UploadedResult } from './models/upload-result.model';

@Resolver(() => Game)
export class GameResolver {
  constructor(private gameService: GameService) {}

  @Query(() => GameList)
  async gameList(@Args() where: GetGameListArgs): Promise<GameList> {
    return this.gameService.fineGamesList(where);
  }

  @Query(() => Game)
  async game(@Args() args: GetGameArgs) {
    return this.gameService.fineGame(args.id);
  }

  @Mutation(() => UploadedResult)
  async uploadBoxArt(
    @Args({ name: 'file', type: () => GraphQLUpload })
    { createReadStream, filename }: FileUpload,
  ) {
    const { id, url } = await this.gameService.uploadBoxArt(
      filename,
      createReadStream(),
    );

    return { id, url };
  }

  @Mutation(() => Game)
  async addGameToLibrary(@Args('data') args: AddGameToLibraryArgs) {
    return this.gameService.createGame(args);
  }
}
