const logger = (...params) => {
  console.log(...params)
}

const errorLogger = (...params) => {
  console.error(...params)
}

module.exports = {logger, errorLogger}