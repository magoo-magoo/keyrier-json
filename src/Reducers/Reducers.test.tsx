import rootReducers from "./Reducers";

describe('Reducers', () => {

    it('rootReducers should run without crashing', () => {
        const results = rootReducers(undefined, {type: ''});
    });
});