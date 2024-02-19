import { all, fork } from 'redux-saga/effects';
// import * as futureFeature1Sagas from './scenes/FutureFeature1/services/sagas';
// import * as futureFeature2Sagas from './scenes/FutureFeature2/services/sagas';
// import * as futureFeature3Sagas from './scenes/FutureFeature3/services/sagas';

export default function* rootSagaSrc() {
  yield all(
    [
      // ...Object.values(futureFeature1Sagas),
      // ...Object.values(futureFeature2Sagas),
      // ...Object.values(futureFeature3Sagas),
      // ...Object.values(futureSagasWillGoHere),
    ].map(fork),
  );
}
