import { resolve, toFileUrl } from "@std/path";
import { parseArgs } from "@std/cli";

async function setBackgroundImage(image: string, dark = false) {
  const command = new Deno.Command("gsettings", {
    args: [
      "set",
      "org.gnome.desktop.background",
      dark ? "picture-uri-dark" : "picture-uri",
      toFileUrl(image).toString(),
    ],
  });

  const { stderr, success } = await command.output();
  if (!success) {
    console.error(stderr);
  }
}

async function getImage() {
  const response = await fetch("https://picsum.photos/1920/1080");
  return response.blob();
}

async function main() {
  const blob = await getImage();
  const home = Deno.env.get("HOME") ?? "";
  const name = "background.jpg";
  const image = home ? resolve(home, "Pictures", name) : name;
  console.log(`Downloading image to ${image}`);
  await Deno.writeFile(image, new Uint8Array(await blob.arrayBuffer()));
  await setBackgroundImage(image, true);
}

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
  const defaultInterval = 15; // minutes
  const flags = parseArgs(Deno.args, {
    boolean: ["help"],
    string: ["time"],
    default: { time: defaultInterval.toString() },
    alias: { help: "h", time: "t" },
  });

  if (flags.help) {
    console.log("Usage: bgrand [options]");
    console.log();
    console.log("Options:");
    console.log("  -h, --help  Show this help message and exit");
    console.log("  -t, --time  Set the time interval in minutes");
    Deno.exit(0);
  }

  const interval = parseInt(flags.time);
  if (isNaN(interval)) {
    console.error("Invalid interval time");
    Deno.exit(1);
  }
  setInterval(main, interval * 60 * 1000);
  main();
}
