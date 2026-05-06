export interface Score {
  playerName: string;
  empathyScore: number;
  totalTime: number;
  leaderboardScore: number;
  grade: string;
  timeFormatted: string;
  timeRating: string;
  datePlayed: string;
  deviceModel: string;
}

export interface FirestoreDocument {
  name: string;
  fields: {
    playerName: { stringValue: string };
    empathyScore: { integerValue: string };
    totalTime: { integerValue: string };
    leaderboardScore: { integerValue: string };
    grade: { stringValue: string };
    timeFormatted: { stringValue: string };
    timeRating: { stringValue: string };
    datePlayed: { stringValue: string };
    deviceModel: { stringValue: string };
  };
  createTime: string;
  updateTime: string;
}

export interface FirestoreResponse {
  documents?: FirestoreDocument[];
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  empathyScore: number;
  timeFormatted: string;
  grade: string;
  datePlayed: string;
  leaderboardScore: number;
}
