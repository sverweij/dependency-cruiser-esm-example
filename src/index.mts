import { IDependency, cruise } from "dependency-cruiser";

const result = await cruise(["build/example.mjs"], {
  baseDir: process.cwd(),
});

const badModule = result.output.modules.reduce<IDependency | null>(
  (acc, mod) => {
    const badDep = mod.dependencies.find((dep) =>
      dep.resolved.includes("react-jss.cjs.js")
    );

    if (!acc && badDep) {
      return badDep;
    }

    return acc;
  },
  null
);

if (badModule) {
  console.log(badModule);
  console.error("Found a CommonJS module version of react-jss in the output");
  process.exit(1);
}
