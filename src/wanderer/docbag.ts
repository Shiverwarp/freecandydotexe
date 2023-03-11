import { buy, Location, toItem } from "kolmafia";
import { get, have } from "libram";
import { DraggableFight, WandererTarget } from "./lib";

export function docBagFactory(
  _type: DraggableFight,
  locationSkiplist: Location[]
): WandererTarget[] {
  const location = get("doctorBagQuestLocation");
  if (location !== null) {
    if (locationSkiplist.includes(location) || location.environment === "outdoor") {
      return [];
    }
    const questItem = toItem(get("doctorBagQuestItem"));
    return [
      new WandererTarget("DoctorBag", location, 1000, () => {
        if (!have(questItem)) {
          buy(1, questItem, 50000);
        }
        return have(questItem);
      }),
    ];
  }
  return [];
}
