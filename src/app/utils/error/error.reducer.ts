import { Action, createReducer, on } from '@ngrx/store';
import { changeErrorState, cleanErrorState } from './error.action';
import { ErrorState } from './error.state';

export const initialState: ErrorState = {
    error: undefined,
    target: undefined,
    message: undefined,
    status: undefined
};

const reducer = createReducer(
    initialState,
    on(
        changeErrorState,
        (state, { payload }) => ({
            error: payload.error,
            target: payload.target,
            message: payload.message ? payload.message : undefined,
            status: payload.status ? payload.status : undefined
        })
    ),
    on(cleanErrorState, () => (initialState))
);


export function errorReducer(
    state: ErrorState | undefined,
    action: Action
): ErrorState {
    return reducer(state, action);
}
