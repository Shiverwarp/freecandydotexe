import { Engine, Outfit } from "grimoire-kolmafia";
import {
  equip,
  inebrietyLimit,
  itemAmount,
  myInebriety,
  myMaxhp,
  myMaxmp,
  restoreHp,
  restoreMp,
  visitUrl,
  xpath,
} from "kolmafia";
import { CandyTask } from "./lib";
import { $familiar, $item, clamp, PropertiesManager, Session } from "libram";

export default class CandyEngine extends Engine<never, CandyTask> {
  session: Session;
  aaBossFlag: number;

  constructor(tasks: CandyTask[]) {
    super(tasks);
    this.aaBossFlag =
      xpath(
        visitUrl("account.php?tab=combat"),
        `//*[@id="opt_flag_aabosses"]/label/input[@type='checkbox']@checked`
      )[0] === "checked"
        ? 1
        : 0;
    this.session = Session.current();
  }

  available(task: CandyTask): boolean {
    const isDrunk = myInebriety() > inebrietyLimit();
    const { sobriety } = task;
    if (isDrunk && sobriety === "sober") return false;
    if (!isDrunk && sobriety === "drunk") return false;
    return super.available(task);
  }

  dress(task: CandyTask, outfit: Outfit): void {
    super.dress(task, outfit);

    if (itemAmount($item`tiny stillsuit`)) {
      equip($familiar`Mosquito`, $item`tiny stillsuit`);
    }
  }

  prepare(task: CandyTask): void {
    super.prepare(task);

    if ("combat" in task) {
      const hpTarget = clamp(0.4 * myMaxhp(), 200, 2000);
      restoreHp(hpTarget);
      const mpTarget = Math.min(150, myMaxmp());
      restoreMp(mpTarget);
    }
  }

  initPropertiesManager(manager: PropertiesManager): void {
    super.initPropertiesManager(manager);
    manager.set({
      currentMood: "nepFarm",
    });
  }
}
