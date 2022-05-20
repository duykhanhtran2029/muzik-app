import { createAction, props } from '@ngrx/store';
import { ErrorState } from './error.state';

export const changeErrorState = createAction(
    '[Error] Change State',
    props<{ payload: ErrorState }>()
);

export const cleanErrorState = createAction(
    '[Error] Clean Error State',
);
