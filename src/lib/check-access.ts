import { $Enums, Arrangement } from "@/generated/prisma";
import Visibility = $Enums.Visibility;

export enum AccessLevel {
  None = 0,
  Read = 1,
  Write = 2
}

export function checkAccess(userId: string | undefined, arrangement: Arrangement): AccessLevel {
  if (userId === arrangement.uploaded_by) {
    return AccessLevel.Write;
  }

  switch (arrangement.visibility) {
    case Visibility.public:
      return AccessLevel.Read;
    case Visibility.unlisted:
      return AccessLevel.Read;
    case Visibility.private:
      return AccessLevel.None;
    default:
      throw new Error("Invalid arrangement visibility");
  }
}
