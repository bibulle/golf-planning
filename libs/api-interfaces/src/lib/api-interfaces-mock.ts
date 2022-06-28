/* eslint-disable @typescript-eslint/no-explicit-any */

import { Club, Course, Parcours, ParcoursResa } from './api-interfaces';

export const PLANNING_MOCK: any[] = [
  { type: Course.TYPE, date: '2022-01-24T11:00:00.000Z', hour: '14:00', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 0, golf_evt_id: '1032458', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-24T11:00:00.000Z', hour: '15:00', title: 'SWING 4U OR', prof: 'Baptiste', places: 0, golf_evt_id: '1032450', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-24T11:00:00.000Z', hour: '18:00', title: 'SWING 4U OR', prof: 'Baptiste', places: 0, golf_evt_id: '1032452', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-25T11:00:00.000Z', hour: '11:00', title: 'SWING 4U BRONZE', prof: 'Baptiste', places: 3, golf_evt_id: '1061358', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-25T11:00:00.000Z', hour: '12:00', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 0, golf_evt_id: '1032505', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-25T11:00:00.000Z', hour: '14:00', title: 'SWING 4U COMPACT', prof: 'Baptiste', places: 0, golf_evt_id: '1032506', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-25T11:00:00.000Z', hour: '15:00', title: 'SWING 4U ARGENT', prof: 'Abdou', places: 3, golf_evt_id: '1061359', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-25T11:00:00.000Z', hour: '15:00', title: 'SWING 4U COMPACT', prof: 'Baptiste', places: 2, golf_evt_id: '1062442', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-25T11:00:00.000Z', hour: '16:00', title: 'SWING 4U COMPACT', prof: 'Abdou', places: 0, golf_evt_id: '1061360', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-25T11:00:00.000Z', hour: '16:00', title: 'SWING 4U OR', prof: 'Baptiste', places: 0, golf_evt_id: '1032504', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-25T11:00:00.000Z', hour: '17:30', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 1, golf_evt_id: '1032508', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-25T11:00:00.000Z', hour: '18:30', title: 'SWING 4U OR', prof: 'Baptiste', places: 0, golf_evt_id: '1032509', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-26T11:00:00.000Z', hour: '9:00', title: 'SWING 4U BRONZE', prof: 'Cédric', places: 4, golf_evt_id: '1032596', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-26T11:00:00.000Z', hour: '10:00', title: 'LECON INDIVIDUELLE 30MIN', prof: 'Cédric', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-26T11:00:00.000Z', hour: '11:00', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 0, golf_evt_id: '1032610', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-26T11:00:00.000Z', hour: '11:30', title: 'LECON INDIVIDUELLE 30MIN', prof: 'Abdou', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-26T11:00:00.000Z', hour: '12:00', title: 'SWING 4U BRONZE', prof: 'Abdou', places: 0, golf_evt_id: '1032606', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-26T11:00:00.000Z', hour: '12:00', title: 'SWING 4U COMPACT', prof: 'Baptiste', places: 0, golf_evt_id: '1032611', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-26T11:00:00.000Z', hour: '14:00', title: 'SWING 4U BRONZE', prof: 'Abdou', places: 1, golf_evt_id: '1032607', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-26T11:00:00.000Z', hour: '14:00', title: 'SWING 4U ARGENT', prof: 'Alexandre', places: 4, golf_evt_id: '1032615', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-26T11:00:00.000Z', hour: '14:00', title: 'SWING 4U OR', prof: 'Baptiste', places: 0, golf_evt_id: '1032612', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-26T11:00:00.000Z', hour: '16:00', title: 'SWING 4U BRONZE', prof: 'Baptiste', places: 2, golf_evt_id: '1032613', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-26T11:00:00.000Z', hour: '17:30', title: 'SWING 4U OR', prof: 'Alexandre', places: 0, golf_evt_id: '1032617', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-26T11:00:00.000Z', hour: '18:30', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 0, golf_evt_id: '1032618', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-27T11:00:00.000Z', hour: '9:00', title: 'SWING 4U COMPACT', prof: 'Alexandre', places: 1, golf_evt_id: '1032880', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-27T11:00:00.000Z', hour: '10:00', title: 'SWING 4U ARGENT', prof: 'Florent', places: 4, golf_evt_id: '1032876', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-27T11:00:00.000Z', hour: '11:00', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 2, golf_evt_id: '1032882', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-27T11:00:00.000Z', hour: '11:00', title: 'LECON INDIVIDUELLE 30MIN', prof: 'Florent', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-27T11:00:00.000Z', hour: '11:30', title: 'LECON INDIVIDUELLE 30MIN', prof: 'Florent', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-27T11:00:00.000Z', hour: '12:00', title: 'SWING 4U ARGENT', prof: 'Florent', places: 0, golf_evt_id: '1032877', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-27T11:00:00.000Z', hour: '13:30', title: 'LECON INDIVIDUELLE 30MIN', prof: 'Alexandre', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-27T11:00:00.000Z', hour: '14:00', title: 'SWING 4U OR', prof: 'Alexandre', places: 0, golf_evt_id: '1032883', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-27T11:00:00.000Z', hour: '14:00', title: 'REGLES 1H', prof: 'Florent', places: 17, golf_evt_id: '1032878', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-27T11:00:00.000Z', hour: '15:00', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 4, golf_evt_id: '1032884', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-27T11:00:00.000Z', hour: '16:00', title: 'SWING 4U COMPACT', prof: 'Cédric', places: 0, golf_evt_id: '1032873', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-27T11:00:00.000Z', hour: '16:00', title: 'SWING 4U ARGENT', prof: 'Florent', places: 5, golf_evt_id: '1032885', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-27T11:00:00.000Z', hour: '17:30', title: 'SWING 4U ARGENT', prof: 'Cédric', places: 0, golf_evt_id: '1032874', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-28T11:00:00.000Z', hour: '10:00', title: 'SWING 4U ARGENT', prof: 'Alexandre', places: 0, golf_evt_id: '1032953', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-28T11:00:00.000Z', hour: '10:00', title: 'SWING 4U BRONZE', prof: 'Cédric', places: 0, golf_evt_id: '1032938', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-28T11:00:00.000Z', hour: '11:00', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 1, golf_evt_id: '1032954', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-28T11:00:00.000Z', hour: '13:00', title: 'SWING 4U PARCOURS', prof: 'Alexandre', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-28T11:00:00.000Z', hour: '13:00', title: 'SWING 4U ARGENT', prof: 'Florent', places: 0, golf_evt_id: '1032943', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-28T11:00:00.000Z', hour: '14:00', title: 'SWING 4U COMPACT', prof: 'Cédric', places: 0, golf_evt_id: '1032940', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-28T11:00:00.000Z', hour: '15:00', title: 'SWING 4U ARGENT', prof: 'Alexandre', places: 2, golf_evt_id: '1032956', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-28T11:00:00.000Z', hour: '16:00', title: 'SWING 4U COMPACT', prof: 'Alexandre', places: 1, golf_evt_id: '1032957', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-28T11:00:00.000Z', hour: '16:00', title: 'REGLES 1H', prof: 'Florent', places: 14, golf_evt_id: '1032945', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-29T11:00:00.000Z', hour: '9:00', title: 'LECON INDIVIDUELLE 30MIN', prof: 'Abdou', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-29T11:00:00.000Z', hour: '9:00', title: 'SWING 4U OR', prof: 'Alexandre', places: 0, golf_evt_id: '1032783', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-29T11:00:00.000Z', hour: '10:00', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 0, golf_evt_id: '1032813', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-29T11:00:00.000Z', hour: '11:00', title: 'SWING 4U OR', prof: 'Alexandre', places: 0, golf_evt_id: '1032784', golf_id: '24', users: [] },
  {
    type: Course.TYPE, date: '2022-01-29T11:00:00.000Z',
    hour: '12:00',
    title: 'SWING 4U ARGENT',
    prof: 'Alexandre',
    places: 3,
    golf_evt_id: '1032785',
    golf_id: '24',
    users: [{ displayName: 'Bibulle Martin', academiergolf_index: 1, academiergolf_userid: 'rame-011008' }],
  },
  { type: Course.TYPE, date: '2022-01-29T11:00:00.000Z', hour: '12:00', title: 'SWING 4U BRONZE', prof: 'Baptiste', places: 0, golf_evt_id: '1032819', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-29T11:00:00.000Z', hour: '14:00', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 0, golf_evt_id: '1032827', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-29T11:00:00.000Z', hour: '16:00', title: 'SWING 4U ARGENT', prof: 'Abdou', places: 0, golf_evt_id: '1032828', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-29T11:00:00.000Z', hour: '16:00', title: 'SWING 4U OR', prof: 'Florent', places: 0, golf_evt_id: '1032773', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-30T11:00:00.000Z', hour: '9:00', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 2, golf_evt_id: '1032834', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-30T11:00:00.000Z', hour: '10:00', title: 'SWING 4U BRONZE', prof: 'Baptiste', places: 0, golf_evt_id: '1032835', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-30T11:00:00.000Z', hour: '11:00', title: 'SWING 4U OR', prof: 'Alexandre', places: 0, golf_evt_id: '1049745', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-30T11:00:00.000Z', hour: '11:00', title: 'SWING 4U COMPACT', prof: 'Baptiste', places: 0, golf_evt_id: '1032836', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-30T11:00:00.000Z', hour: '12:00', title: 'SWING 4U ARGENT', prof: 'Alexandre', places: 0, golf_evt_id: '1032809', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-30T11:00:00.000Z', hour: '12:30', title: 'LECON INDIVIDUELLE 30MIN', prof: 'Abdou', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-30T11:00:00.000Z', hour: '14:00', title: 'SWING 4U OR', prof: 'Abdou', places: 0, golf_evt_id: '1032808', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-30T11:00:00.000Z', hour: '14:00', title: 'SWING 4U ARGENT', prof: 'Alexandre', places: 2, golf_evt_id: '1049758', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-30T11:00:00.000Z', hour: '14:00', title: 'SWING 4U COMPACT', prof: 'Baptiste', places: 0, golf_evt_id: '1032800', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-30T11:00:00.000Z', hour: '14:00', title: 'REGLES 1H', prof: 'Florent', places: 16, golf_evt_id: '1032795', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-30T11:00:00.000Z', hour: '15:00', title: 'SWING 4U BRONZE', prof: 'Florent', places: 1, golf_evt_id: '1049744', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-30T11:00:00.000Z', hour: '16:00', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 0, golf_evt_id: '1032811', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-30T11:00:00.000Z', hour: '16:00', title: 'SWING 4U ARGENT', prof: 'Florent', places: 0, golf_evt_id: '1032796', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-31T11:00:00.000Z', hour: '9:00', title: 'SWING 4U BRONZE', prof: 'Baptiste', places: 7, golf_evt_id: '1032524', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-31T11:00:00.000Z', hour: '11:00', title: 'SWING 4U OR', prof: 'Baptiste', places: 0, golf_evt_id: '1032526', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-31T11:00:00.000Z', hour: '12:00', title: 'SWING 4U BRONZE', prof: 'Abdou', places: 0, golf_evt_id: '1032519', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-31T11:00:00.000Z', hour: '14:00', title: 'SWING 4U OR', prof: 'Abdou', places: 0, golf_evt_id: '1032520', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-31T11:00:00.000Z', hour: '14:00', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 1, golf_evt_id: '1032528', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-31T11:00:00.000Z', hour: '15:00', title: 'LECON INDIVIDUELLE 1 HEURE', prof: 'Abdou', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-01-31T11:00:00.000Z', hour: '18:00', title: 'SWING 4U OR', prof: 'Abdou', places: 0, golf_evt_id: '1032522', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-01T11:00:00.000Z', hour: '9:00', title: 'SWING 4U BRONZE', prof: 'Abdou', places: 7, golf_evt_id: '1033694', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-01T11:00:00.000Z', hour: '11:00', title: 'REGLES 1H', prof: 'Charles', places: 10, golf_evt_id: '1033775', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-01T11:00:00.000Z', hour: '12:00', title: 'SWING 4U PARCOURS', prof: 'Baptiste', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-01T11:00:00.000Z', hour: '14:00', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 0, golf_evt_id: '1033698', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-01T11:00:00.000Z', hour: '14:00', title: 'SWING 4U COMPACT', prof: 'Charles', places: 0, golf_evt_id: '1033703', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-01T11:00:00.000Z', hour: '14:30', title: 'LECON INDIVIDUELLE 30MIN', prof: 'Abdou', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-01T11:00:00.000Z', hour: '16:00', title: 'SWING 4U BRONZE', prof: 'Abdou', places: 5, golf_evt_id: '1033689', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-01T11:00:00.000Z', hour: '16:00', title: 'SWING 4U BRONZE', prof: 'Charles', places: 5, golf_evt_id: '1033705', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-01T11:00:00.000Z', hour: '17:30', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 2, golf_evt_id: '1033772', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-01T11:00:00.000Z', hour: '18:30', title: 'SWING 4U BRONZE', prof: 'Charles', places: 0, golf_evt_id: '1033773', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-02T11:00:00.000Z', hour: '9:00', title: 'LECON INDIVIDUELLE 30MIN', prof: 'Cédric', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-02T11:00:00.000Z', hour: '9:30', title: 'LECON INDIVIDUELLE 30MIN', prof: 'Cédric', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-02T11:00:00.000Z', hour: '10:00', title: 'SWING 4U OR', prof: 'Abdou', places: 0, golf_evt_id: '1033406', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-02T11:00:00.000Z', hour: '10:00', title: 'SWING 4U COMPACT', prof: 'Florent', places: 0, golf_evt_id: '1033401', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-02T11:00:00.000Z', hour: '12:00', title: 'SWING 4U BRONZE', prof: 'Abdou', places: 0, golf_evt_id: '1033408', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-02T11:00:00.000Z', hour: '12:00', title: 'SWING 4U COMPACT', prof: 'Alexandre', places: 0, golf_evt_id: '1033418', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-02T11:00:00.000Z', hour: '12:00', title: 'SWING 4U OR', prof: 'Baptiste', places: 0, golf_evt_id: '1033413', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-02T11:00:00.000Z', hour: '14:00', title: 'SWING 4U BRONZE', prof: 'Abdou', places: 2, golf_evt_id: '1033409', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-02T11:00:00.000Z', hour: '15:00', title: 'SWING 4U COMPACT', prof: 'Baptiste', places: 0, golf_evt_id: '1033415', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-02T11:00:00.000Z', hour: '18:30', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 3, golf_evt_id: '1033422', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-03T11:00:00.000Z', hour: '9:00', title: 'SWING 4U COMPACT', prof: 'Alexandre', places: 4, golf_evt_id: '1033537', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-03T11:00:00.000Z', hour: '10:00', title: 'SWING 4U ARGENT', prof: 'Florent', places: 6, golf_evt_id: '1033533', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-03T11:00:00.000Z', hour: '11:00', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 4, golf_evt_id: '1033539', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-03T11:00:00.000Z', hour: '12:00', title: 'SWING 4U ARGENT', prof: 'Florent', places: 0, golf_evt_id: '1033534', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-03T11:00:00.000Z', hour: '13:00', title: 'SWING 4U PARCOURS', prof: 'Alexandre', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-03T11:00:00.000Z', hour: '14:00', title: 'REGLES 1H', prof: 'Florent', places: 20, golf_evt_id: '1033535', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-03T11:00:00.000Z', hour: '15:00', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 6, golf_evt_id: '1033541', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-03T11:00:00.000Z', hour: '16:00', title: 'SWING 4U COMPACT', prof: 'Cédric', places: 4, golf_evt_id: '1033530', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-03T11:00:00.000Z', hour: '16:00', title: 'SWING 4U ARGENT', prof: 'Florent', places: 7, golf_evt_id: '1033542', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-03T11:00:00.000Z', hour: '17:30', title: 'SWING 4U ARGENT', prof: 'Cédric', places: 3, golf_evt_id: '1033531', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-04T11:00:00.000Z', hour: '9:00', title: 'SWING 4U COMPACT', prof: 'Cédric', places: 4, golf_evt_id: '1033609', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-04T11:00:00.000Z', hour: '10:00', title: 'SWING 4U ARGENT', prof: 'Alexandre', places: 6, golf_evt_id: '1033625', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-04T11:00:00.000Z', hour: '10:00', title: 'SWING 4U BRONZE', prof: 'Cédric', places: 8, golf_evt_id: '1033610', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-04T11:00:00.000Z', hour: '11:00', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 7, golf_evt_id: '1033626', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-04T11:00:00.000Z', hour: '13:00', title: 'SWING 4U ARGENT', prof: 'Florent', places: 2, golf_evt_id: '1033615', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-04T11:00:00.000Z', hour: '14:00', title: 'SWING 4U COMPACT', prof: 'Cédric', places: 0, golf_evt_id: '1033612', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-04T11:00:00.000Z', hour: '15:00', title: 'SWING 4U ARGENT', prof: 'Alexandre', places: 4, golf_evt_id: '1033628', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-04T11:00:00.000Z', hour: '16:00', title: 'SWING 4U COMPACT', prof: 'Alexandre', places: 1, golf_evt_id: '1033629', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-05T11:00:00.000Z', hour: '10:00', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 2, golf_evt_id: '1033395', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-05T11:00:00.000Z', hour: '12:00', title: 'SWING 4U BRONZE', prof: 'Abdou', places: 0, golf_evt_id: '1032975', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-05T11:00:00.000Z', hour: '12:00', title: 'SWING 4U COMPACT', prof: 'Cédric', places: 0, golf_evt_id: '1032962', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-05T11:00:00.000Z', hour: '14:00', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 1, golf_evt_id: '1033007', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-05T11:00:00.000Z', hour: '15:00', title: 'SWING 4U ARGENT', prof: 'Cédric', places: 2, golf_evt_id: '1033394', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-06T11:00:00.000Z', hour: '9:00', title: 'SWING 4U BRONZE', prof: 'Baptiste', places: 5, golf_evt_id: '1032998', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-06T11:00:00.000Z', hour: '9:00', title: 'SWING 4U ARGENT', prof: 'Cédric', places: 7, golf_evt_id: '1032982', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-06T11:00:00.000Z', hour: '12:00', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 7, golf_evt_id: '1033000', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-06T11:00:00.000Z', hour: '12:00', title: 'SWING 4U COMPACT', prof: 'Cédric', places: 0, golf_evt_id: '1032984', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-06T11:00:00.000Z', hour: '14:00', title: 'SWING 4U BRONZE', prof: 'Abdou', places: 3, golf_evt_id: '1058906', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-06T11:00:00.000Z', hour: '14:00', title: 'SWING 4U ARGENT', prof: 'Alexandre', places: 6, golf_evt_id: '1058903', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-06T11:00:00.000Z', hour: '14:00', title: 'SWING 4U PARCOURS', prof: 'Baptiste', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-06T11:00:00.000Z', hour: '15:00', title: 'SWING 4U OR', prof: 'Alexandre', places: 0, golf_evt_id: '1058904', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-06T11:00:00.000Z', hour: '15:00', title: 'SWING 4U BRONZE', prof: 'Baptiste', places: 0, golf_evt_id: '1033002', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-06T11:00:00.000Z', hour: '16:00', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 7, golf_evt_id: '1058905', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-06T11:00:00.000Z', hour: '16:00', title: 'REGLES 1H', prof: 'Baptiste', places: 12, golf_evt_id: '1055305', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-06T11:00:00.000Z', hour: '16:00', title: 'SWING 4U COMPACT', prof: 'Cédric', places: 0, golf_evt_id: '1058902', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-07T11:00:00.000Z', hour: '9:00', title: 'SWING 4U BRONZE', prof: 'Baptiste', places: 8, golf_evt_id: '1033932', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-07T11:00:00.000Z', hour: '10:00', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 7, golf_evt_id: '1033933', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-07T11:00:00.000Z', hour: '12:00', title: 'SWING 4U BRONZE', prof: 'Abdou', places: 2, golf_evt_id: '1033926', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-07T11:00:00.000Z', hour: '13:00', title: 'SWING 4U PARCOURS', prof: 'Baptiste', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-07T11:00:00.000Z', hour: '14:00', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 6, golf_evt_id: '1033936', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-07T11:00:00.000Z', hour: '15:00', title: 'SWING 4U BRONZE', prof: 'Abdou', places: 6, golf_evt_id: '1033937', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-08T11:00:00.000Z', hour: '10:00', title: 'LECON INDIVIDUELLE 30MIN', prof: 'Abdou', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-08T11:00:00.000Z', hour: '10:30', title: 'LECON INDIVIDUELLE 30MIN', prof: 'Abdou', places: 0, golf_evt_id: null, golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-08T11:00:00.000Z', hour: '12:00', title: 'SWING 4U BRONZE', prof: 'Charles', places: 5, golf_evt_id: '1033707', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-08T11:00:00.000Z', hour: '14:00', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 8, golf_evt_id: '1033716', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-08T11:00:00.000Z', hour: '14:00', title: 'SWING 4U COMPACT', prof: 'Charles', places: 0, golf_evt_id: '1033721', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-08T11:00:00.000Z', hour: '16:00', title: 'REGLES 1H', prof: 'Abdou', places: 10, golf_evt_id: '1033776', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-08T11:00:00.000Z', hour: '16:00', title: 'SWING 4U BRONZE', prof: 'Charles', places: 8, golf_evt_id: '1033723', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-08T11:00:00.000Z', hour: '18:30', title: 'SWING 4U BRONZE', prof: 'Charles', places: 5, golf_evt_id: '1033779', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-09T11:00:00.000Z', hour: '9:00', title: 'SWING 4U BRONZE', prof: 'Cédric', places: 8, golf_evt_id: '1033423', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-09T11:00:00.000Z', hour: '11:00', title: 'SWING 4U ARGENT', prof: 'Baptiste', places: 8, golf_evt_id: '1033437', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-09T11:00:00.000Z', hour: '12:00', title: 'SWING 4U BRONZE', prof: 'Abdou', places: 8, golf_evt_id: '1033433', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-09T11:00:00.000Z', hour: '12:00', title: 'SWING 4U COMPACT', prof: 'Baptiste', places: 0, golf_evt_id: '1033438', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-09T11:00:00.000Z', hour: '14:00', title: 'SWING 4U BRONZE', prof: 'Abdou', places: 5, golf_evt_id: '1033434', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-09T11:00:00.000Z', hour: '14:00', title: 'SWING 4U ARGENT', prof: 'Alexandre', places: 8, golf_evt_id: '1033442', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-09T11:00:00.000Z', hour: '16:00', title: 'SWING 4U BRONZE', prof: 'Baptiste', places: 6, golf_evt_id: '1033440', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-09T11:00:00.000Z', hour: '18:30', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 6, golf_evt_id: '1033445', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-10T11:00:00.000Z', hour: '9:00', title: 'SWING 4U COMPACT', prof: 'Alexandre', places: 4, golf_evt_id: '1033552', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-10T11:00:00.000Z', hour: '10:00', title: 'SWING 4U ARGENT', prof: 'Florent', places: 8, golf_evt_id: '1033548', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-10T11:00:00.000Z', hour: '11:00', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 8, golf_evt_id: '1033554', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-10T11:00:00.000Z', hour: '12:00', title: 'SWING 4U ARGENT', prof: 'Florent', places: 5, golf_evt_id: '1033549', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-10T11:00:00.000Z', hour: '14:00', title: 'SWING 4U BRONZE', prof: 'Alexandre', places: 8, golf_evt_id: '1033556', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-10T11:00:00.000Z', hour: '15:00', title: 'DECATHLON', prof: 'Florent', places: 0, golf_evt_id: '1061376', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-10T11:00:00.000Z', hour: '16:00', title: 'SWING 4U ARGENT', prof: 'Alexandre', places: 8, golf_evt_id: '1033557', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-10T11:00:00.000Z', hour: '16:00', title: 'SWING 4U COMPACT', prof: 'Cédric', places: 0, golf_evt_id: '1033545', golf_id: '24', users: [] },
  { type: Course.TYPE, date: '2022-02-10T11:00:00.000Z', hour: '17:30', title: 'SWING 4U ARGENT', prof: 'Cédric', places: 8, golf_evt_id: '1033546', golf_id: '24', users: [] },
];

export const COURSE_MOCK: any[] = [
  {
    type: Course.TYPE,
    date: '2021-11-13T11:00:00.000Z',
    hour: '15:00',
    title: 'INITIATION 2H',
    prof: 'Florent',
    places: 0,
    golf_evt_id: null,
    golf_id: null,
    users: [{ displayName: 'Bibulle Martin', academiergolf_index: 1 }],
  },
  {
    type: Course.TYPE,
    date: '2021-11-22T11:00:00.000Z',
    hour: '19:00',
    title: 'SWING 4U ARGENT',
    prof: 'Abdou',
    places: 0,
    golf_evt_id: null,
    golf_id: null,
    users: [
      { displayName: 'Bibulle Martin', academiergolf_index: 1 },
      { displayName: 'Nathalie M', academiergolf_index: 2 },
    ],
  },
  {
    type: Course.TYPE,
    date: '2021-11-26T11:00:00.000Z',
    hour: '12:00',
    title: 'SWING 4U BRONZE',
    prof: 'Alexandre',
    places: 0,
    golf_evt_id: null,
    golf_id: null,
    users: [
      { displayName: 'Bibulle Martin', academiergolf_index: 1 },
      { displayName: 'Nathalie M', academiergolf_index: 2 },
    ],
  },
  {
    type: Course.TYPE,
    date: '2021-11-29T11:00:00.000Z',
    hour: '19:00',
    title: 'SWING 4U ARGENT',
    prof: 'Abdou',
    places: 0,
    golf_evt_id: null,
    golf_id: null,
    users: [
      { displayName: 'Bibulle Martin', academiergolf_index: 1 },
      { displayName: 'Nathalie M', academiergolf_index: 2 },
    ],
  },
  {
    type: Course.TYPE,
    date: '2021-12-03T11:00:00.000Z',
    hour: '13:00',
    title: 'SWING 4U BRONZE',
    prof: 'Alexandre',
    places: 0,
    golf_evt_id: null,
    golf_id: null,
    users: [
      { displayName: 'Bibulle Martin', academiergolf_index: 1 },
      { displayName: 'Nathalie M', academiergolf_index: 2 },
    ],
  },
  {
    type: Course.TYPE,
    date: '2021-12-06T11:00:00.000Z',
    hour: '18:30',
    title: 'SWING 4U ARGENT',
    prof: 'Abdou',
    places: 0,
    golf_evt_id: null,
    golf_id: null,
    users: [
      { displayName: 'Bibulle Martin', academiergolf_index: 1 },
      { displayName: 'Nathalie M', academiergolf_index: 2 },
    ],
  },
  {
    type: Course.TYPE,
    date: '2021-12-10T11:00:00.000Z',
    hour: '13:00',
    title: 'SWING 4U ARGENT',
    prof: 'Alexandre',
    places: 0,
    golf_evt_id: null,
    golf_id: null,
    users: [
      { displayName: 'Bibulle Martin', academiergolf_index: 1 },
      { displayName: 'Nathalie M', academiergolf_index: 2 },
    ],
  },
  {
    type: Course.TYPE,
    date: '2021-12-13T11:00:00.000Z',
    hour: '19:00',
    title: 'SWING 4U BRONZE',
    prof: 'Abdou',
    places: 0,
    golf_evt_id: null,
    golf_id: null,
    users: [
      { displayName: 'Bibulle Martin', academiergolf_index: 1 },
      { displayName: 'Nathalie M', academiergolf_index: 2 },
    ],
  },
  {
    type: Course.TYPE,
    date: '2021-12-18T11:00:00.000Z',
    hour: '14:00',
    title: 'SWING 4U BRONZE',
    prof: 'Charles',
    places: 0,
    golf_evt_id: null,
    golf_id: null,
    users: [
      { displayName: 'Bibulle Martin', academiergolf_index: 1 },
      { displayName: 'Nathalie M', academiergolf_index: 2 },
    ],
  },
  {
    type: Course.TYPE,
    date: '2021-12-22T11:00:00.000Z',
    hour: '10:00',
    title: 'SWING 4U COMPACT',
    prof: 'Florent',
    places: 0,
    golf_evt_id: null,
    golf_id: null,
    users: [
      { displayName: 'Bibulle Martin', academiergolf_index: 1 },
      { displayName: 'Nathalie M', academiergolf_index: 2 },
    ],
  },
  {
    type: Course.TYPE,
    date: '2022-01-08T11:00:00.000Z',
    hour: '14:00',
    title: 'SWING 4U BRONZE',
    prof: 'Charles',
    places: 0,
    golf_evt_id: null,
    golf_id: null,
    users: [
      { displayName: 'Bibulle Martin', academiergolf_index: 1 },
      { displayName: 'Nathalie M', academiergolf_index: 2 },
    ],
  },
  {
    type: Course.TYPE,
    date: '2022-01-15T11:00:00.000Z',
    hour: '14:00',
    title: 'SWING 4U BRONZE',
    prof: 'Florent',
    places: 0,
    golf_evt_id: null,
    golf_id: null,
    users: [
      { displayName: 'Bibulle Martin', academiergolf_index: 1 },
      { displayName: 'Nathalie M', academiergolf_index: 2 },
    ],
  },
  {
    type: Course.TYPE,
    date: '2022-01-22T11:00:00.000Z',
    hour: '15:00',
    title: 'SWING 4U COMPACT',
    prof: 'Cédric',
    places: 4,
    golf_evt_id: null,
    golf_id: null,
    users: [{ displayName: 'Nathalie M', academiergolf_index: 2 }],
  },
  {
    type: Course.TYPE,
    date: '2022-01-29T11:00:00.000Z',
    hour: '12:00',
    title: 'SWING 4U ARGENT',
    prof: 'Alexandre',
    places: 3,
    golf_evt_id: null,
    golf_id: null,
    users: [{ displayName: 'Bibulle Martin', academiergolf_index: 1 }],
  },
];

export const USERS_MOCK: any[] = [
  {
    displayName: 'Bibulle Martin',
    academiergolf_index: 1,
    academiergolf_userid: 'rame-011008',
    academiergolf_login: 'foo@gmail.com',
    academiergolf_password: 'ffsdfsg"éqsdfq',
  },
  { displayName: 'Nathalie M', academiergolf_index: 2, academiergolf_userid: 'rame-011029', academiergolf_login: 'bar@gmail.com', academiergolf_password: 'gsqdgsggg' },
];

export const CALENDAR_MOCK: any[] = [
  {
    id: 'bt9hs1lbgrr2nmmh5enu5lg7s8',
    summary: 'Cours golf : INITIATION 2H (Florent)',
    location: 'Golf de Toulouse La Ramée, Av. du Général Eisenhower, 31170 Tournefeuille, France',
    start: { dateTime: '2021-11-13T15:00:00+01:00', timeZone: 'GMT+01:00' },
    end: { dateTime: '2021-11-13T16:00:00+01:00', timeZone: 'GMT+01:00' },
  },
  {
    id: 'm1r33goabf5sjl0q5p18l8i6d8',
    summary: 'Cours golf : SWING 4U ARGENT (Abdou)',
    location: 'Golf de Toulouse La Ramée, Av. du Général Eisenhower, 31170 Tournefeuille, France',
    start: { dateTime: '2021-11-22T19:00:00+01:00', timeZone: 'GMT+01:00' },
    end: { dateTime: '2021-11-22T20:00:00+01:00', timeZone: 'GMT+01:00' },
  },
  {
    id: '0eiobutdln051mq67ik6lme8b4',
    summary: 'Cours golf : SWING 4U BRONZE (Alexandre)',
    location: 'Golf de Toulouse La Ramée, Av. du Général Eisenhower, 31170 Tournefeuille, France',
    start: { dateTime: '2021-11-26T12:00:00+01:00', timeZone: 'GMT+01:00' },
    end: { dateTime: '2021-11-26T13:00:00+01:00', timeZone: 'GMT+01:00' },
  },
  {
    id: '0t2jom2u7npso1rp4co4uibjeo',
    summary: 'Cours golf : SWING 4U ARGENT (Abdou)',
    location: 'Golf de Toulouse La Ramée, Av. du Général Eisenhower, 31170 Tournefeuille, France',
    start: { dateTime: '2021-11-29T19:00:00+01:00', timeZone: 'GMT+01:00' },
    end: { dateTime: '2021-11-29T20:00:00+01:00', timeZone: 'GMT+01:00' },
  },
  {
    id: '11qtvl05imlg7e35eonurou124',
    summary: 'Cours golf : SWING 4U BRONZE (Alexandre)',
    location: 'Golf de Toulouse La Ramée, Av. du Général Eisenhower, 31170 Tournefeuille, France',
    start: { dateTime: '2021-12-03T13:00:00+01:00', timeZone: 'GMT+01:00' },
    end: { dateTime: '2021-12-03T14:00:00+01:00', timeZone: 'GMT+01:00' },
  },
  {
    id: '8cg0a32angno2ii6ridjmk7org',
    summary: 'Cours golf : SWING 4U ARGENT (Abdou)',
    location: 'Golf de Toulouse La Ramée, Av. du Général Eisenhower, 31170 Tournefeuille, France',
    start: { dateTime: '2021-12-06T18:30:00+01:00', timeZone: 'GMT+01:00' },
    end: { dateTime: '2021-12-06T19:30:00+01:00', timeZone: 'GMT+01:00' },
  },
  {
    id: '_asp5kphhdp66qsg',
    summary: 'Vaccinodrome Toulouse Hall 8',
    location: 'Hall 8, Parc des Expositions, Pont de la croix de Pierre, 31400, Toulouse',
    start: { dateTime: '2021-12-10T11:45:00+01:00', timeZone: 'GMT+01:00' },
    end: { dateTime: '2021-12-10T11:50:00+01:00', timeZone: 'GMT+01:00' },
  },
  {
    id: 'hlo7c6ab8a3241r2rkoh8nal44',
    summary: 'Cours golf : SWING 4U ARGENT (Alexandre)',
    location: 'Golf de Toulouse La Ramée, Av. du Général Eisenhower, 31170 Tournefeuille, France',
    start: { dateTime: '2021-12-10T13:00:00+01:00', timeZone: 'GMT+01:00' },
    end: { dateTime: '2021-12-10T14:00:00+01:00', timeZone: 'GMT+01:00' },
  },
  {
    id: 'gnq6k584cp94ielokanrirhpmk',
    summary: 'Cours golf : SWING 4U BRONZE (Abdou)',
    location: 'Golf de Toulouse La Ramée, Av. du Général Eisenhower, 31170 Tournefeuille, France',
    start: { dateTime: '2021-12-13T19:00:00+01:00', timeZone: 'GMT+01:00' },
    end: { dateTime: '2021-12-13T20:00:00+01:00', timeZone: 'GMT+01:00' },
  },
  {
    id: 't2u8d98o0b2bbqo1esa34s5pg8',
    summary: 'Cours golf : SWING 4U BRONZE (Charles)',
    location: 'Golf de Toulouse La Ramée, Av. du Général Eisenhower, 31170 Tournefeuille, France',
    start: { dateTime: '2021-12-18T14:00:00+01:00', timeZone: 'GMT+01:00' },
    end: { dateTime: '2021-12-18T15:00:00+01:00', timeZone: 'GMT+01:00' },
  },
  { id: '56dnd06oiduuatlg1q4o829u3h_20220627', summary: 'Anniversaire Nath', start: { date: '2022-06-27' }, end: { date: '2022-06-28' } },
];

export const PARCOURS_19628_MOCK: Parcours = {id:19628,club_id:17108,holes:9,name:"Parcours Compact"};
export const CLUB_17108_MOCK: Club = {id:17108,name:"UGOLF Toulouse La Ramée",city:"Tournefeuille",country:"France",phone_number:"05 61 07 09 09"};

export const PARCOURS_RESA_MOCK: ParcoursResa[] = [
  { type: ParcoursResa.TYPE, club_id: 17108, holes: 9, booking_reference: '41B2-1ZIA', teetime: new Date('2022-06-12T15:40:00.000Z'), course_id: 19628, course: PARCOURS_19628_MOCK,club: CLUB_17108_MOCK },
  { type: ParcoursResa.TYPE, club_id: 17108, holes: 9, booking_reference: 'O1FR-ZS6F', teetime: new Date('2022-06-05T16:00:00.000Z'), course_id: 19628, course: PARCOURS_19628_MOCK,club: CLUB_17108_MOCK },
  { type: ParcoursResa.TYPE, club_id: 17108, holes: 9, booking_reference: 'P4IF-QV0G', teetime: new Date('2022-05-26T14:10:00.000Z'), course_id: 19628, course: PARCOURS_19628_MOCK,club: CLUB_17108_MOCK },
  { type: ParcoursResa.TYPE, club_id: 17108, holes: 9, booking_reference: 'J21R-TB8U', teetime: new Date('2022-04-18T09:10:00.000Z'), course_id: 19628, course: PARCOURS_19628_MOCK,club: CLUB_17108_MOCK },
  { type: ParcoursResa.TYPE, club_id: 17108, holes: 9, booking_reference: 'UJK9-UYYS', teetime: new Date('2021-12-24T13:10:00.000Z'), course_id: 19628, course: PARCOURS_19628_MOCK,club: CLUB_17108_MOCK },
];
