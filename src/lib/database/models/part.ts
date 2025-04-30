import { Collection, Db, FindCursor, UpdateResult } from "mongodb";

export default class Part {
  static readonly collection_name = "parts";
  public readonly collection: Collection<Part>;

  constructor(
    private readonly database: Db,
    public arrangement_id: string,
    public part_id: string,
    public is_full_score: boolean,
    public name: string,
    public file_path: string,
    public preview_image_path: string,
  ) {
    this.collection = this.database.collection(Part.collection_name);
  }

  static async find(database: Db, filter: Partial<Part>): Promise<FindCursor<Part>> {
    return database.collection(Part.collection_name).find<Part>(filter);
  }

  async upsert(): Promise<UpdateResult<Part>> {
    return await this.collection.updateOne({ part_id: this.part_id }, { $set: this }, { upsert: true });
  }

  async remove() {
    return await this.collection.deleteOne({ part_id: this.part_id });
  }
}
