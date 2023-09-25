import { IDependency, cruise } from "dependency-cruiser";

const result = await cruise(["build/example.mjs"], {
  baseDir: process.cwd(),
  enhancedResolveOptions: {
    // by default this is just ["main"], if you use the
    // configuration scaffolded with `dependency-cruiser --init` now
    // it would add ["main", "types", "typings"] in .dependency-cruiser.js
    // which is (was) a reasonable default for most of today's projects
    // adding "module" in front of the array would make enhanced resolve 
    // look at the "module" field first, before considering any of the
    // others.
    mainFields: ["module", "main", "types", "typings"],
    // Additionally (but not strictly necessary to fix the issue described in
    // https://github.com/sverweij/dependency-cruiser/issues/843)
    // it's usually practical to also configure what exports fields
    // should be used, and  which _conditionNames_ to consider
    exportsFields: ["exports"],
    conditionNames: ["import", "require", "node", "default"],
  },
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
