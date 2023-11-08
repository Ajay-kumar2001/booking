import { ObjectId } from "mongodb";
import draftStorage, { HotelDocument } from "../models/draftModel";

export const checkingForExistingHotel = async (
  docId: string
): Promise<boolean> => {
  const hotleDetails = await draftStorage.findById(docId);
  if (hotleDetails) {
    if (hotleDetails.hotelsList.length === 0) {
      const documentId: object = new ObjectId(docId);
      const deletedDocument: HotelDocument | null =
        await draftStorage.findByIdAndDelete(documentId, {
          useFindAndModify: false,
        });
      console.log(" from checkingForExistingHotel ", deletedDocument);
      if (!deletedDocument) {
        return true;
      }
    } else {
      return false;
    }
  }
  return false;
};
