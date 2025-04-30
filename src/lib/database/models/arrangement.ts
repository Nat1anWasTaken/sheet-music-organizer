import { Collection, Db, DeleteResult, FindCursor, UpdateResult } from "mongodb";
import Part from "@/lib/database/models/part";

export enum Visibility {
  Public = "public",
  Private = "private",
  Unlisted = "unlisted",
}

export default class ArrangementModel {
  static readonly collection_name = "arrangements";
  public readonly collection: Collection<ArrangementModel>;

  constructor(
    private readonly database: Db,
    public readonly arrangement_id: string,
    public visibility: Visibility,
    public uploaded_at: Date,
    public uploaded_by: string,
    public title: string,
    public composers: string[],
    public arrangement_type: string,
    public parts: Part[],
  ) {
    this.collection = this.database.collection(ArrangementModel.collection_name);
  }

  static async find(database: Db, filter: Partial<ArrangementModel>): Promise<FindCursor<ArrangementModel>> {
    return database.collection(ArrangementModel.collection_name).find<ArrangementModel>(filter);
  }

  async upsert(): Promise<UpdateResult<ArrangementModel>> {
    return await this.collection.updateOne({ arrangement_id: this.arrangement_id }, { $set: this }, { upsert: true });
  }

  async remove(): Promise<DeleteResult> {
    await this.parts[0]?.collection.deleteMany({ arrangement_id: this.arrangement_id });
    return await this.collection.deleteOne({ arrangement_id: this.arrangement_id });
  }
}
