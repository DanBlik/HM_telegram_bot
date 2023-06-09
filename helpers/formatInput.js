const formatInput = (inputText) =>
  inputText
    .split(" ")
    .map((word) => word.replace("/", ""))
    .join(" ");

export default formatInput;
