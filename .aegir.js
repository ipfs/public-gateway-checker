const replaceNodeBuiltIns = () => {
  const replace = {
    'os': require.resolve('os-browserify')
  }
  const filter = RegExp(`^(${Object.keys(replace).join("|")})$`);
  return {
    name: "replaceNodeBuiltIns",
    setup(build) {
      build.onResolve({ filter }, arg => ({
        path: replace[arg.path],
      }));
    }
  };
}

/** @type {import('aegir').PartialOptions} */
module.exports = {
  tsRepo: true,
  release: {
    build: false
  },
  build: {
    config: {
      plugins: [replaceNodeBuiltIns()]
    }
  },
  docs: {
    publish: true,
    entryPoint: 'src/index.ts'
  }
}
