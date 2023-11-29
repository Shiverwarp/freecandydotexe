import { trickOutfit } from "./outfit";
import { CandyTask } from "./lib";
import { CandyStrategy } from "./combat";
import { $effect, $item, $location, have } from "libram";
import { abort, cliExecute, haveEffect, myAdventures, numericModifier, use } from "kolmafia";

const TRICK_TREAT_TASKS: CandyTask[] = [
  {
    name: "Farm Solenoids",
    completed: () => myAdventures() === 0,
    prepare: (): void => {
      if (!have($effect`Blue Swayed`, 51)) {
        const swayedTurnsNeeded = 51 - haveEffect($effect`Blue Swayed`);
        const taffyNeeded = Math.ceil(swayedTurnsNeeded / 10);
        use(taffyNeeded, $item`pulled blue taffy`);
      }
      if (numericModifier("Item Drop") < 234) {
        cliExecute("tcrsgain 234 item 48 eff");
      }
      if (numericModifier("Familiar Experience") < 23) {
        cliExecute("tcrsgain 23 familiar experience 100 eff");
      }
      if (numericModifier("Familiar Experience") < 23 || numericModifier("Item Drop") < 234) {
        abort("We couldn't cap our familiar exp and item drop!");
      }
    },
    // eslint-disable-next-line libram/verify-constants
    do: $location`Spring Bros. Solenoids`,
    outfit: trickOutfit,
    combat: new CandyStrategy(),
  },
];

export default TRICK_TREAT_TASKS;
