const fs = require("fs");
const path = require("path");
const QRCode = require("qrcode");

function parseArgs(argv) {
  const args = {
    link: "",
    out: "",
    size: 512,
    margin: 2,
    format: "png",
    dark: "#000000",
    light: "#ffffff",
  };
  const positionals = [];

  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if ((token === "--link" || token === "-l") && argv[i + 1]) {
      args.link = argv[i + 1];
      i += 1;
      continue;
    }
    if ((token === "--out" || token === "-o") && argv[i + 1]) {
      args.out = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === "--size" && argv[i + 1]) {
      args.size = Number(argv[i + 1]);
      i += 1;
      continue;
    }
    if (token === "--margin" && argv[i + 1]) {
      args.margin = Number(argv[i + 1]);
      i += 1;
      continue;
    }
    if (token === "--format" && argv[i + 1]) {
      args.format = String(argv[i + 1]).toLowerCase();
      i += 1;
      continue;
    }
    if (token === "--dark" && argv[i + 1]) {
      args.dark = argv[i + 1];
      i += 1;
      continue;
    }
    if (token === "--light" && argv[i + 1]) {
      args.light = argv[i + 1];
      i += 1;
      continue;
    }

    if (token === "--help" || token === "-h") {
      args.link = "--help";
      continue;
    }

    if (!token.startsWith("-")) {
      positionals.push(token);
    }
  }

  if (!args.link && positionals[0]) {
    args.link = positionals[0];
  }

  if (!args.out && positionals[1]) {
    args.out = positionals[1];
  }

  return args;
}

function showHelp() {
  console.log(`Usage:
  node scripts/generate-qr.js --link "https://example.com" [options]

Options:
  --link, -l    Link to encode (required)
  --out, -o     Output file path (default: out/qr-code.<format>)
  --format      png or svg (default: png)
  --size        Width in pixels (default: 512)
  --margin      Quiet zone size in modules (default: 2)
  --dark        Dark module color (default: #000000)
  --light       Light background color (default: #ffffff)
`);
}

function normalizeOutputPath(outPath, format) {
  const defaultPath = path.join("out", `qr-code.${format}`);
  const target = outPath ? outPath : defaultPath;
  const parsed = path.parse(target);

  if (!parsed.ext) {
    return `${target}.${format}`;
  }

  return target;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.link || args.link === "--help" || args.link === "-h") {
    showHelp();
    process.exit(args.link ? 0 : 1);
  }

  if (!["png", "svg"].includes(args.format)) {
    throw new Error("Invalid --format. Use 'png' or 'svg'.");
  }

  if (!Number.isFinite(args.size) || args.size <= 0) {
    throw new Error("Invalid --size. Use a positive number.");
  }

  if (!Number.isFinite(args.margin) || args.margin < 0) {
    throw new Error("Invalid --margin. Use 0 or greater.");
  }

  const outputPath = normalizeOutputPath(args.out, args.format);
  const absoluteOutputPath = path.resolve(process.cwd(), outputPath);
  fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });

  const commonOptions = {
    margin: Math.floor(args.margin),
    color: {
      dark: args.dark,
      light: args.light,
    },
  };

  if (args.format === "svg") {
    const svg = await QRCode.toString(args.link, {
      ...commonOptions,
      type: "svg",
      width: Math.floor(args.size),
    });
    fs.writeFileSync(absoluteOutputPath, svg, "utf8");
  } else {
    await QRCode.toFile(absoluteOutputPath, args.link, {
      ...commonOptions,
      width: Math.floor(args.size),
    });
  }

  console.log("QR written to %s", absoluteOutputPath);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
