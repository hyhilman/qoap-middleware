child_process = undefined
launchSpec = undefined
path = undefined
process = undefined
runExternal = undefined
child_process = require('child_process')
process = global.process
path = require('path')

runExternal = (command, callback) ->
  child = undefined
  console.log 'Running ' + command
  child = child_process.spawn('/bin/sh', [
    '-c'
    command
  ])
  child.stdout.on 'data', (data) ->
    process.stdout.write data
  child.stderr.on 'data', (data) ->
    process.stderr.write data
  if callback != null
    return child.on('exit', callback)
  return

launchSpec = (args, callback) ->
  runExternal 'NODE_ENV=test LOG_LEVEL=none ./node_modules/.bin/babel-node ./node_modules/.bin/babel-istanbul cover ./node_modules/.bin/_mocha ' + args, callback

task 'spec', ->
  launchSpec '-- --recursive --timeout 5000 --compilers js:babel-register test', (result) ->
    process.exit result
task 'spec:ci', ->
  runExternal 'NODE_ENV=test LOG_LEVEL=none ./node_modules/.bin/babel-node ./node_modules/.bin/_mocha --recursive --timeout 5000 --compilers js:babel-register test', (result) ->
    process.exit result
task 'features', ->
  runExternal 'NODE_ENV=test LOG_LEVEL=none ./node_modules/.bin/cucumber.js -t ~@wip --compiler js:babel-register', (result) ->
    if result != 0
      console.log 'FAIL: scenarios should not fail'
    process.exit result
task 'features:wip', ->
  runExternal 'NODE_ENV=test LOG_LEVEL=none ./node_modules/.bin/cucumber.js -t @wip --compiler js:babel-register', (result) ->
    if result == 0
      console.log 'FAIL: wip scenarios should fail'
      return process.exit(1)
    return
return