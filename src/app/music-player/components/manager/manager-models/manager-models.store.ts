import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { Tag, TrainedModel } from 'src/app/interfaces/model.interface';
import { ModelService } from 'src/app/music-player/services/model.service';
import { ApiRequestStatus } from 'src/app/utils/api-request-status.enum';

export interface ManagerModelState {
  model: TrainedModel;
  tags: Tag[];
  getModelStatus: ApiRequestStatus;
  getTagsStatus: ApiRequestStatus;
}
export const initialState: ManagerModelState = {
  model: undefined,
  getModelStatus: undefined,
  tags: [],
  getTagsStatus: undefined,
};

@Injectable()
export class ManagerModelStore extends ComponentStore<ManagerModelState> {
  //#region ***Selectors***
  readonly model$: Observable<TrainedModel> = this.select(
    (state) => state.model
  );

  readonly getModelStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.getModelStatus
  );

  readonly tags$: Observable<Tag[]> = this.select((state) => state.tags);

  readonly getTagsStatus$: Observable<ApiRequestStatus> = this.select(
    (state) => state.getTagsStatus
  );

  //#endregion

  //#region ***Updaters (Reducers in @ngrx/store term)***

  readonly updateModel = this.updater((state, model: TrainedModel) => ({
    ...state,
    model,
  }));

  readonly updateGetModelStatus = this.updater(
    (state, getModelStatus: ApiRequestStatus) => ({
      ...state,
      getModelStatus,
    })
  );

  readonly updateTags = this.updater((state, tags: Tag[]) => ({
    ...state,
    tags,
  }));

  readonly updateGetTagsStatus = this.updater(
    (state, getTagsStatus: ApiRequestStatus) => ({
      ...state,
      getTagsStatus,
    })
  );

  //#endregion

  //#region ***Effects***
  readonly getModelEffect = this.effect((genreID$: Observable<string>) =>
    genreID$.pipe(
      tap(() => this.updateGetModelStatus(ApiRequestStatus.Requesting)),
      switchMap((genreID) =>
        this.modelService.getModelInformation(genreID).pipe(
          tapResponse(
            (model) => {
              this.updateModel(model);
              this.updateGetModelStatus(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetModelStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );


    readonly getTagsEffect = this.effect((event$) =>
    event$.pipe(
      tap(() => this.updateGetTagsStatus(ApiRequestStatus.Requesting)),
      switchMap(() =>
        this.modelService.getTagInformation().pipe(
          tapResponse(
            (tags) => {
              this.updateTags(tags);
              this.updateGetTagsStatus(ApiRequestStatus.Success);
            },
            (err) => {
              this.updateGetTagsStatus(ApiRequestStatus.Fail);
            }
          )
        )
      )
    )
  );



  //#endregion

  constructor(private modelService: ModelService) {
    super(initialState);
  }
}
