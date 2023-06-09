const formatInput = (inputText) =>
  inputText
    .split(" ")
    .map((word) => word.replace("/", ""))
    .join(" ");

module.exports = formatInput