module.exports = {
  command: 'adapter:create',
  aliases: ['c'],
  desc: 'Create an adapter for a payment gateway',
  builder: (args) => {
    return args
      .positional('adapter-name', {
        description: 'An identifier for the gateway/module',
        // required: true,
      });
  },
  handler: (argv) => {
    const adapterName = argv._[1]
  }
}
