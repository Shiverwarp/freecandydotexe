import { trickOutfit } from "./outfit";
import { CandyTask } from "./lib";
import { CandyStrategy } from "./combat";
import { $effect, $item, $location, get, have } from "libram";
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
        cliExecute("tcrsgain 400 item 28 eff");
      }
      if (get("gooseDronesRemaining") < 10 && numericModifier("Familiar Experience") < 23) {
        cliExecute("tcrsgain 23 familiar experience 100 eff");
      }
      if (
        (get("gooseDronesRemaining") < 10 && numericModifier("Familiar Experience") < 23) ||
        numericModifier("Item Drop") < 400 ||
        numericModifier("Familiar Experience") < 10
      ) {
        abort("We couldn't cap our familiar exp and item drop!");
      }
    },
    do: $location`Moonshiners' Woods`,
    outfit: () => trickOutfit(),
    combat: new CandyStrategy(),
    choices: { 975: 2 }, //Skip
  },
];

export default TRICK_TREAT_TASKS;
