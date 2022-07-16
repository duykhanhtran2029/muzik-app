export interface TrainedModel {
  type: string;
  accurancy: number;
  loss: number;
  typeofFeature: string;
  numberOfTrainedFile: number;
  id: string;
  precision?: number;
  f1Score?: number;
  recall?: number;
}

export interface Tag {
  id: string;
  name: string;
  numberOfFile: number;
}
