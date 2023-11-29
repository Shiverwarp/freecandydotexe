import { Args, getTasks, Quest } from "grimoire-kolmafia";
import args from "./args";
import { questStep, set } from "libram";
import { CandyTask } from "./lib";
import CandyEngine from "./engine";
import GLOBAL_TASKS from "./regularTasks";
import TRICK_TREAT_TASKS from "./trickTreatTasks";
import { myAdventures, print } from "kolmafia";

export default function main(argstring = ""): void {
  Args.fill(args, argstring);
  if (args.help) {
    Args.showHelp(args);
    return;
  }

  const nemesisStep = () => questStep("questG04Nemesis");
  const doingNemesis = nemesisStep() >= 17 && nemesisStep() < 25;

  const noMoreAdventures = () => {
    if (myAdventures() <= 0) {
      print("Out of adventures! Stopping.", "red");
      return true;
    }
    return false;
  };

  const doneWithNemesis = () => {
    if (doingNemesis && nemesisStep() >= 25) {
      print("Fought the final nemesis wanderer! Stopping.", "red");
      return true;
    }
    return false;
  };

  // Allow re-running after losing a combat
  set("_lastCombatLost", false);

  const quest: Quest<CandyTask> = {
    name: "hacking your system",
    completed: () => noMoreAdventures() || doneWithNemesis(),
    tasks: [...GLOBAL_TASKS, ...TRICK_TREAT_TASKS],
  };

  const engine = new CandyEngine(getTasks([quest]));

  try {
    engine.run();
  } finally {
    engine.destruct();
  }
}
