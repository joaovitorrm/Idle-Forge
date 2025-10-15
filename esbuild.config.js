import esbuild from "esbuild";
import globImport from "esbuild-plugin-glob-import";

async function startBuild() {
  const ctx = await esbuild.context({
    entryPoints: ["src/main.ts"],
    bundle: true,
    outdir: "dist",
    plugins: [globImport()],
    loader: { ".png": "file" },
  });

  // Inicia o watch
  await ctx.watch();
  console.log("Build inicial feito. Watch ativado!");
}

startBuild().catch(console.error);
